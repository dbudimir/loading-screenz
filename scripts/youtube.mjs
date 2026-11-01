// Turns a YouTube link into a built-in loading screen, in two passes:
//
//   pnpm youtube <url> --inspect
//     Downloads the video (cached), prints its details and any black stretches at the start or end,
//     and saves frame sheets to look at before choosing trim points.
//
//   pnpm youtube <url> --id dreamcast [--start s] [--end s] [--length 15] [--crf 38] [--height 1080] [--no-audio]
//     Encodes it to public/media/<id>.mp4 with scripts/encode.mjs and saves a frame sheet of the result.
//
// Requires uv (for uvx yt-dlp), Node, and ffmpeg/ffprobe with libsvtav1 and libopus.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    inspect: { type: 'boolean', default: false },
    id: { type: 'string' },
    start: { type: 'string' },
    end: { type: 'string' },
    length: { type: 'string' },
    crf: { type: 'string' },
    height: { type: 'string' },
    'no-audio': { type: 'boolean', default: false },
  },
});

const url = positionals[0];
const youtubeId = url?.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1];
if (!youtubeId || (!values.inspect && !values.id)) {
  console.error('Usage: pnpm youtube <url> --inspect');
  console.error('       pnpm youtube <url> --id name [--start s] [--end s] [--length 15] [--crf 38] [--height 1080] [--no-audio]');
  process.exit(1);
}

const workDir = join('/tmp/loading-screenz', youtubeId);
mkdirSync(workDir, { recursive: true });

const run = (command, args, options = {}) => execFileSync(command, args, { encoding: 'utf8', ...options });
const ffprobeDuration = file =>
  Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));

/** Saves a 4x3 grid of 12 frames sampled evenly from [from, from + span) of the file. */
function frameSheet(file, output, from, span, width) {
  run('ffmpeg', [
    '-v', 'error', '-y', '-ss', String(from), '-t', String(span), '-i', file,
    '-vf', `fps=${12 / span},scale=${width}:-2,tile=4x3`, '-frames:v', '1', output,
  ]);
}

const metaPath = join(workDir, 'meta.json');
if (!existsSync(metaPath)) {
  console.log(`Downloading ${url} …`);
  const json = run('uvx', [
    'yt-dlp', '--js-runtimes', 'node', '--quiet', '--no-warnings',
    '-f', 'bv*[height<=1080]+ba/b[height<=1080]',
    '-o', join(workDir, 'source.%(ext)s'),
    '--no-simulate', '--dump-json', `https://www.youtube.com/watch?v=${youtubeId}`,
  ], { maxBuffer: 64 * 1024 * 1024 });
  const info = JSON.parse(json);
  const meta = {
    url: `https://www.youtube.com/watch?v=${youtubeId}`,
    title: info.title,
    uploader: info.uploader ?? info.channel,
    uploaderUrl: info.uploader_url ?? info.channel_url,
    uploadDate: info.upload_date,
    license: info.license ?? null,
  };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}
const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
const sourceName = readdirSync(workDir).find(name => name.startsWith('source.'));
if (!sourceName) throw new Error(`Download finished but no source file is in ${workDir}.`);
const source = join(workDir, sourceName);

if (values.inspect) {
  const stream = JSON.parse(
    run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,r_frame_rate', '-of', 'json', source])
  ).streams[0];
  const hasAudio = run('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', source]).trim() !== '';
  const duration = ffprobeDuration(source);
  const [num, den] = stream.r_frame_rate.split('/').map(Number);

  console.log(`\nTitle:    ${meta.title}`);
  console.log(`Uploader: ${meta.uploader} (${meta.uploaderUrl})`);
  console.log(`Source:   ${source}`);
  console.log(`Video:    ${duration.toFixed(2)}s, ${stream.width}x${stream.height} @ ${(num / den).toFixed(2)}fps, ${stream.codec_name}, ${hasAudio ? 'has audio' : 'no audio'}`);

  // A frame is black when even its brightest pixel is near black (16 in video range). Average brightness would
  // flag dark scenes like Resident Evil's door, and blackdetect misses black that runs to the end of the file.
  // ffmpeg logs to stderr, which execFileSync only returns on failure, so it's captured through a pipe.
  const log = execFileSync(
    'sh',
    ['-c', `ffmpeg -v info -i "$0" -vf signalstats,metadata=print:key=lavfi.signalstats.YMAX -an -f null - 2>&1`, source],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  );
  const frames = [...log.matchAll(/pts_time:([\d.]+)\n.*?YMAX=([\d.]+)/g)].map(m => ({
    time: Number(m[1]),
    black: Number(m[2]) < 24,
  }));
  const frameLength = den / num;
  const black = [];
  for (const frame of frames) {
    const last = black.at(-1);
    if (!frame.black) continue;
    if (last && frame.time - last[1] < frameLength / 2) last[1] = frame.time + frameLength;
    else black.push([frame.time, frame.time + frameLength]);
  }
  console.log(`Black:    ${black.length ? black.map(([a, b]) => `${a.toFixed(2)}–${b.toFixed(2)}s`).join(', ') : 'none'}`);

  const leading = frames[0]?.black ? black[0] : undefined;
  const trailing = frames.at(-1)?.black ? black.at(-1) : undefined;
  const suggested = [leading && `--start ${leading[1].toFixed(2)}`, trailing && `--end ${trailing[0].toFixed(2)}`].filter(Boolean);
  if (suggested.length) console.log(`Suggest:  ${suggested.join(' ')} (trims black at the edges)`);

  const edge = Math.min(2, duration / 2);
  frameSheet(source, join(workDir, 'overview.png'), 0, duration, 480);
  frameSheet(source, join(workDir, 'start.png'), 0, edge, 320);
  frameSheet(source, join(workDir, 'end.png'), duration - edge, edge, 320);
  console.log(`\nFrame sheets (12 frames each, left to right, top to bottom):`);
  console.log(`  ${join(workDir, 'overview.png')}  whole video, one frame every ${(duration / 12).toFixed(2)}s`);
  console.log(`  ${join(workDir, 'start.png')}  first ${edge.toFixed(1)}s, one frame every ${(edge / 12).toFixed(2)}s`);
  console.log(`  ${join(workDir, 'end.png')}  last ${edge.toFixed(1)}s from ${(duration - edge).toFixed(2)}s, one frame every ${(edge / 12).toFixed(2)}s`);
  process.exit(0);
}

const encodeArgs = ['scripts/encode.mjs', source, '--id', values.id];
for (const flag of ['start', 'end', 'length', 'crf', 'height']) if (values[flag]) encodeArgs.push(`--${flag}`, values[flag]);
if (values['no-audio']) encodeArgs.push('--no-audio');
run('node', encodeArgs, { stdio: 'inherit' });

const output = `public/media/${values.id}.mp4`;
const resultSheet = join(workDir, 'result.png');
frameSheet(output, resultSheet, 0, ffprobeDuration(output), 480);
console.log(`\nResult frame sheet: ${resultSheet}`);
console.log(`Credit: ${meta.uploader}, ${meta.url}`);
