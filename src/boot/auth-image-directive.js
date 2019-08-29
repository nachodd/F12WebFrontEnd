import axios from "axios"

const VueAuthImage = {
  install(Vue, pluginOptions) {
    Vue.directive("auth-src", {
      bind: function(element, binding) {
        setImgSrc(element, binding, pluginOptions)
      },
    })
  },
}

function setImgSrc(element, binding, pluginOptions) {
  if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    let imageUrl
    element.dataset.loaded = "0"

    if (typeof binding.value === "string" && binding.value.length > 0) {
      imageUrl = binding.value
    } else if (typeof binding.value === "object" && binding.value.src && binding.value.src !== "") {
      imageUrl = binding.value.src
    } else {
      throw Error(
        "v-auth-src: You must provide the URL of the image on hte value of the attribute (as a String) or as an object with key 'src'",
      )
    }

    // Default options values
    const options = {
      token: "",
      headerAuthKey: "Authorization",
      headerAuthValuePrefix: "Bearer ",
      aditionalHeaders: {},
      downloadingText: "Downloading",
      dotsAnimation: true,

      // TODO: implementar estos campos y tal vez: placeHolderText y placeHolderErrorText
      placeholderImg: "",
      errorImg: "",
    }

    // try to get the values
    // TOKEN:
    if (typeof binding.value === "object" && binding.value.token && binding.value.token !== "") {
      options.token = binding.value.token
    } else if (
      typeof pluginOptions === "object" &&
      pluginOptions.token &&
      typeof pluginOptions.token === "function"
    ) {
      options.token = pluginOptions.token()
    } else {
      throw Error(
        "v-auth-src: You must provide the Token via options on instanciate or v-auth-src values",
      )
    }

    // Header: auth key (only via options)
    if (
      typeof pluginOptions === "object" &&
      pluginOptions.headerAuthKey &&
      pluginOptions.headerAuthKey !== ""
    ) {
      options.headerAuthKey = pluginOptions.headerAuthKey
    }

    // Header: auth value prefix (Bearer) (only via options)
    if (
      typeof pluginOptions === "object" &&
      pluginOptions.headerAuthValuePrefix &&
      pluginOptions.headerAuthValuePrefix !== ""
    ) {
      options.headerAuthValuePrefix = pluginOptions.headerAuthValuePrefix
    }

    // Header: aditional headers
    if (
      typeof pluginOptions === "object" &&
      pluginOptions.aditionalHeaders &&
      typeof pluginOptions.aditionalHeaders === "object"
    ) {
      options.aditionalHeaders = pluginOptions.aditionalHeaders
    }

    if (
      typeof binding.value === "object" &&
      binding.value.downloadingText &&
      binding.value.downloadingText !== ""
    ) {
      options.downloadingText = binding.value.downloadingText
    } else if (
      typeof pluginOptions === "object" &&
      pluginOptions.downloadingText &&
      pluginOptions.downloadingText !== ""
    ) {
      options.downloadingText = pluginOptions.downloadingText
    }

    // dotsAnimation
    if (typeof binding.value === "object" && binding.value.dotsAnimation) {
      options.dotsAnimation = Boolean(binding.value.dotsAnimation)
    } else if (typeof pluginOptions === "object" && pluginOptions.dotsAnimation) {
      options.dotsAnimation = Boolean(pluginOptions.dotsAnimation)
    }

    let interval
    element.style.float = "left"
    element.style.marginLeft = "-16px"
    element.alt = options.downloadingText
    if (options.dotsAnimation === true) {
      interval = setInterval(() => {
        element.alt += "."
        if (element.alt.length === options.downloadingText.length + 4) {
          element.alt = options.downloadingText
        }
      }, 500)
    }

    const authHeader = {}
    authHeader[`${options.headerAuthKey}`] = `${options.headerAuthValuePrefix}${options.token}`

    axios({
      method: "get",
      url: imageUrl,
      responseType: "arraybuffer",
      headers: {
        ...authHeader,
        ...options.aditionalHeaders,
      },
    })
      .then(resp => {
        if (options.dotsAnimation === true) {
          clearInterval(interval)
        }
        var mimeType = resp.headers["content-type"].toLowerCase()
        // eslint-disable-next-line no-undef
        var imgBase64 = Buffer.from(resp.data, "binary").toString("base64")

        element.src = "data:" + mimeType + ";base64," + imgBase64
        element.style.float = ""
        element.style.marginLeft = ""
        element.alt = ""
        element.dataset.loaded = "1"
      })
      .catch(e => {
        if (options.dotsAnimation === true) {
          clearInterval(interval)
        }
        console.log(e)
        element.alt = "No se puedo cargar 😥"
        element.style.float = "left"
      })
  }
}

export default VueAuthImage
