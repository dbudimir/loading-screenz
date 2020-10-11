const showLoader = async e => {
  e.preventDefault()

  const bodyElm = document.getElementsByTagName('BODY')[0]
  const items = bodyElm.querySelectorAll('body > *')
  const clickElm = e.currentTarget as HTMLAnchorElement

  if (clickElm.tagName === 'A') {
    //  Import react
    await import('../ui/loading')
      .then(loader => loader)
      .catch(error => console.log('error'))

    // Speed up video
    document.querySelector('video').playbackRate = 2

    // Clear everything fix body
    bodyElm.setAttribute('style', 'padding: 0px')
    items.forEach(item => {
      !item.classList.contains('fixed-elm') &&
        (item as HTMLElement).setAttribute('style', 'display: none;')
    })

    setTimeout(() => {
      window.location.href = clickElm.href
    }, 4000)
  }
}

chrome.runtime.sendMessage({}, response => {
  var checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady)
      console.log("We're in the injected content script!")

      let anchors = document.querySelectorAll('a')
      // Add listener to all link
      for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', showLoader)
      }
    }
  })
})
