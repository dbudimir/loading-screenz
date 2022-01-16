import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'

import '../styles/popup.css'

const Popup = () => {
  // State
  const [settings, setSettings] = useState({
    onUrlChange: false,
    frequency: 5,
    duration: 5
  })

  const updateSettings = e => {
    const { id, value } = e.target

    chrome.storage.sync.set({
      onUrlChange: false,
      frequency: id === 'frequency' ? value : settings.frequency,
      duration: id === 'duration' ? value : settings.duration
    })
  }

  useEffect(() => {
    chrome.storage.sync.get(['frequency', 'duration'], result => {
      setSettings({
        onUrlChange: result.onUrlChange,
        frequency: result.frequency,
        duration: result.duration
      })
    })
  }, [])

  return (
    <div className='popup-padded'>
      <h2>tester</h2>
      <span>fun times</span>
      <hr />

      <span>Show on Url Change</span>
      <div className='checkbox-input'>
        <input
          type='checkbox'
          className='check-box'
          id='check-box'
          onChange={e => {
            setSettings({ ...settings, onUrlChange: !settings.onUrlChange })
            updateSettings(e)
          }}
        />
        <span className='input value'>{settings.onUrlChange}</span>
      </div>

      <span>Loader Frequency</span>
      <div className='slider-input'>
        <input
          type='range'
          min='1'
          max='100'
          className='slider'
          id='frequency'
          value={settings.frequency}
          onChange={e => {
            setSettings({ ...settings, frequency: e.target.value })
            updateSettings(e)
          }}
        />
        <span className='input value'>{settings.frequency}</span>
      </div>
      <span>Loader Duration</span>
      <div className='slider-input'>
        <input
          type='range'
          min='1'
          max='10'
          className='slider'
          id='duration'
          value={settings.duration}
          onChange={e => {
            setSettings({ ...settings, duration: e.target.value })
            updateSettings(e)
          }}
        />
        <span className='input value'>{settings.duration}</span>
      </div>
    </div>
  )
}

// --------------

ReactDOM.render(<Popup />, document.getElementById('root'))
