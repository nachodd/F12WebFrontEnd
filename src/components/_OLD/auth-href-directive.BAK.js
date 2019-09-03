import request from "utils/request"
// import { saveAs } from "file-saver"
import { lastPartOfPath } from "utils/helpers"

export default ({ Vue }) => {
  Vue.directive("auth-href", {
    bind: function(element, binding) {
      setClickListener(element, binding)
    },
    componentUpdated: function(element, binding) {
      setClickListener(element, binding)
    },
  })
}

function setClickListener(element, binding) {
  // Si quiesiera acceder al argumento del la directiva (lo que esta luego de los :) o al valor,
  // let type = binding.arg
  // let myFunction = binding.value
  if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    // como a la directiva no le pasamos ningun value, lo extraigo directamente del element al href
    element.removeEventListener("click", eventClick.bind(null, element))
    element.addEventListener("click", eventClick.bind(null, element))
  }
}

const files = {}

function eventClick(element) {
  // prevent default click action (click on a link)
  event.preventDefault()

  // store the original href locally
  const href = element.href

  // check if the attribete data-downloading is present. If it isn't, add it. If it's present, the link was already clicked so cancel the operation
  const isDownloading = element.getAttribute("data-downloading")
  if (!isDownloading) {
    element.setAttribute("data-downloading", "true")
  } else {
    return false
  }

  // Store the node original HTML content and put the fancy message
  files[href] = element.innerHTML
  element.innerHTML = "Descargando"
  element.removeAttribute("href") // Remove the original href to prevent click it more than once (and remove the styles)

  // This is for the dots animation
  const interval = setInterval(() => {
    element.innerHTML += "."
    if (element.innerHTML.length === 15) {
      element.innerHTML = "Descargando"
    }
  }, 500)

  request({
    method: "GET",
    url: href,
    responseType: "blob",
  })
    .then(response => {
      // Take the response and fire the download process
      const blob = new Blob([response.data], { type: response.data.type })
      // saveAs(blob, lastPartOfPath(href))

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const contentDisposition = response.headers["content-disposition"]
      let fileName = lastPartOfPath(href)
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch.length === 2) fileName = fileNameMatch[1]
      }
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      // this is for images: (responseType must be ArrayBuffer)
      // var mimeType = resp.headers['content-type'].toLowerCase();
      // var imgBase64 = new Buffer(resp.data, 'binary').toString('base64');
      // element.src = 'data:' + mimeType + ';base64,' + imgBase64;
    })
    .catch(e => {
      console.log(e)
      // el.src = imageUrl;
    })
    .finally(() => {
      // Restore the link back to it's original state
      clearInterval(interval)
      element.innerHTML = files[href]
      element.setAttribute("href", href)
      element.removeAttribute("data-downloading")
    })
}
