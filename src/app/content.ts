import loader from '../ui/loading'

chrome.runtime.sendMessage({}, response => {
  var checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady)
      console.log("We're in the injected content script!")

      let anchors = document.querySelectorAll('a')
      let linkList = []

      // Loop
      for (var i = 0; i < anchors.length; i++) {
        //
        let originalLink = anchors[i].href
        linkList.push(originalLink)
        //
        anchors[i].removeAttribute('href')
        anchors[i].setAttribute('name', originalLink)
        anchors[i].setAttribute('style', 'cursor: pointer;')

        anchors[i].addEventListener('click', e => {
          e.preventDefault()

          const bodyElm = document.getElementsByTagName('BODY')[0]
          const items = bodyElm.querySelectorAll('body > *')

          items.forEach(item => {
            !item.classList.contains('fixed-elm') &&
              (item as HTMLInputElement).setAttribute('style', 'display: none;')
          })

          console.log(e.target)
          e.target && loader()
        })
      }
    }
  })
})
