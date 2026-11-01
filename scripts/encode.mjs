// Turns any video into a built-in loading screen: AV1 + Opus in MP4, at most 1080p / 30fps, at most 15 seconds long.
// Requires ffmpeg and ffprobe built with libsvtav1 and libopus (Homebrew's ffmpeg has both).
//
// Usage: pnpm encode <input> [--id halo] [--start 2] [--end 28] [--length 15] [--crf 38] [--height 1080] [--no-audio]

import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { basename, extname } from 'node:path';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    id: { type: 'string' },
    start: { type: 'string' },
    end: { type: 'string' },
    length: { type: 'string', default: '15' },
    crf: { type: 'string', default: '38' },
    height: { type: 'string', default: '1080' },
    'no-audio': { type: 'boolean', default: false },
  },
});

const input = positionals[0];
if (!input) {
  console.error('Usage: pnpm encode <input> [--id name] [--start s] [--end s] [--length 15] [--crf 38] [--height 1080] [--no-audio]');
  process.exit(1);
}

const probe = JSON.parse(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', input])
);
const sourceDuration = Number(probe.format.duration);
const hasAudio = probe.streams.some(stream => stream.codec_type === 'audio') && !values['no-audio'];

const start = Number(values.start ?? 0);
const end = Math.min(Number(values.end ?? sourceDuration), sourceDuration);
const segment = end - start;
const target = Number(values.length);
if (!(segment > 0)) throw new Error(`Nothing to encode between ${start}s and ${end}s.`);

// Longer segments are sped up to fit the target length. Shorter ones keep their natural speed and length.
const speed = Math.max(1, segment / target);
const id = values.id ?? basename(input, extname(input)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const output = `public/media/${id}.mp4`;

const args = ['-v', 'error', '-y', '-ss', String(start), '-to', String(end), '-i', input];
args.push(
  '-vf',
  `setpts=PTS/${speed},fps=30,scale=-2:'min(${values.height},ih)':flags=lanczos`,
  '-c:v', 'libsvtav1', '-crf', values.crf, '-preset', '4', '-pix_fmt', 'yuv420p'
);
if (hasAudio) args.push('-af', `atempo=${speed}`, '-c:a', 'libopus', '-b:a', '48k');
else args.push('-an');
args.push('-movflags', '+faststart', output);

console.log(`Encoding ${input} (${start}s–${end.toFixed(1)}s, ${speed.toFixed(2)}× speed) → ${output}`);
execFileSync('ffmpeg', args, { stdio: 'inherit', env: { ...process.env, SVT_LOG: '1' } });

const size = statSync(output).size;
const duration = Number(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', output]).toString()
);
console.log(`Done: ${(size / 1024).toFixed(0)} KB, ${duration.toFixed(1)}s${hasAudio ? '' : ', no audio'}`);
console.log(`\nAdd this to BUILT_IN_LOADERS in src/shared/loaders.ts if it's new:`);
console.log(`  { id: '${id}', name: '${id}', builtIn: true, category: 'game' | 'console', path: 'media/${id}.mp4' },`);
