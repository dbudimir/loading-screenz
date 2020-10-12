const showLoader = async e => {
  e.preventDefault()
  //

  const body = document.getElementsByTagName('BODY')[0]
  const items = body.querySelectorAll('body > *')
  const clickElm = e.currentTarget as HTMLAnchorElement

  //
  // Get the user settings
  chrome.storage.sync.get(['frequency', 'duration'], async result => {
    // Timout for redirect
    const runNow =
      Math.floor(Math.random() * Math.floor(100)) < result.frequency

    if (runNow && document.readyState === 'complete') {
      //
      setTimeout(() => {
        window.location.href = clickElm.href
      }, result.duration * 1000 - 250)

      if (clickElm.tagName === 'A') {
        //  Import react
        await import('../ui/loading')
          .then(loader => loader)
          .catch(error => console.log('error'))

        const video = document.querySelector('video')

        // Updated video playback duratoin
        video.addEventListener('loadedmetadata', () => {
          const rate = 1 / (result.duration / video.duration)

          video.playbackRate = rate
        })

        // Clear everything fix body
        const html = document.documentElement

        html.setAttribute( 'style', 'padding: 0px !important; margin: 0px !important;' ) // prettier-ignore
        body.setAttribute( 'style', 'padding: 0px !important; margin: 0px !important;' ) // prettier-ignore
        // Remove everything
        items.forEach(item => {
          !item.classList.contains('fixed-elm') &&
            (item as HTMLElement).setAttribute('style', 'display: none;')
        })
      }
    } else {
      window.location.href = clickElm.href
    }
  })
}

chrome.runtime.sendMessage({}, response => {
  var checkReady = setInterval(() => {
    //
    if (document.readyState === 'complete') {
      clearInterval(checkReady)
      console.log("We're in the injected content script!")

      // Get all the link
      let anchors = document.querySelectorAll('a')
      // Add listener to all link
      for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', showLoader)
      }
    }
  })
})
