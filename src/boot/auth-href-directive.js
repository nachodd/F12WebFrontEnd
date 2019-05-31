import request from "@utils/request"
import { saveAs } from "file-saver"
import { lastPartOfPath } from "@utils/helpers"

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
  // let type = binding.arg
  // let myFunction = binding.value
  if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    // const href = binding.value
    element.removeEventListener("click", eventClick.bind(null, element))
    element.addEventListener("click", eventClick.bind(null, element))
  }
}

async function eventClick(element) {
  // prevent default click
  event.preventDefault()
  const href = element.href
  debugger

  request({
    method: "GET",
    url: href,
    responseType: "blob",
  })
    .then(response => {
      const blob = new Blob([response.data], { type: response.data.type })
      saveAs(blob, lastPartOfPath(href))

      /* const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const contentDisposition = response.headers["content-disposition"]
      let fileName = "unknown"
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch.length === 2) fileName = fileNameMatch[1]
      }
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url) */

      // var mimeType = resp.headers['content-type'].toLowerCase();
      // var imgBase64 = new Buffer(resp.data, 'binary').toString('base64');
      // el.src = 'data:' + mimeType + ';base64,' + imgBase64;
    })
    .catch(e => {
      console.log(e)
      // el.src = imageUrl;
    })
}
