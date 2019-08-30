import { Notify } from "quasar"
import { Dialog } from "quasar"
import DialogCustom from "comp/Common/DialogCustom"
import request from "utils/request"

export function firstWord(string) {
  return string.replace(/ .*/, "")
}

export function firstToUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function lastPartOfPath(string) {
  if (typeof string === "string" && string.length > 0 && string.includes("/")) {
    return string.substring(string.lastIndexOf("/") + 1)
  }
  return ""
}
export function extension(string) {
  if (typeof string === "string" && string.length > 0 && string.includes(".")) {
    return string.substring(string.lastIndexOf(".") + 1)
  }
  return ""
}

export function warn({
  message = "Hubo un problema al procesar su petición. Intente nuevamente más tarde",
  timeout = 5000,
  color = "negative",
  textColor = "white",
  icon = "warning",
  actions = [{ label: "CERRAR", color: "white" }],
}) {
  return Notify.create({
    color,
    textColor,
    message,
    icon,
    position: "top-right",
    timeout,
    multiline: true,
    actions,
  })
}

export function info({
  message = "Hubo requerimientos actualizados",
  timeout = 5000,
  color = "blue-8",
  textColor = "white",
  icon = "info",
  actions = [{ label: "CERRAR", color: "white" }],
}) {
  return Notify.create({
    color,
    textColor,
    message,
    icon,
    position: "top-right",
    timeout,
    multiline: true,
    actions,
  })
}

export function success({
  message = "Su petición fue procesada correctamente!",
  timeout = 5000,
  color = "positive",
  textColor = "white",
  icon = "thumb_up",
  actions = [{ label: "CERRAR", color: "white" }],
}) {
  return Notify.create({
    color,
    textColor,
    message,
    icon,
    position: "top-right",
    timeout,
    multiline: true,
    actions,
  })
}

/**
 * Parse Laravel errors array and return ul>li formatted
 *
 * @param {Object} errors key(string)-value(array) of errors to be parsed
 * @returns {String} plain html string of ul > li > ul > li whit errors
 */
export function parseErrors(errors) {
  const errorList = _.reduce(
    errors,
    (res, errorList, key) => {
      const errorsForKey = _.reduce(
        errorList,
        // eslint-disable-next-line no-unused-vars
        (res1, error, key2) => {
          return `<li>${error}</li>${res1}`
        },
        "",
      )
      const keyToUpper = firstToUpper(key).replace("_", " ")
      return `<li><strong>${keyToUpper}</strong>: <ul>${errorsForKey}</ul></li>${res}`
    },
    "",
  )
  return `<ul>${errorList}</ul>`
}

export function warnDialog({
  message,
  title = "Aviso",
  titleBackgroundClass = "bg-red-6",
  titleClass = "text-white",
  persistent = true,
}) {
  return new Promise(resolve => {
    Dialog.create({
      component: DialogCustom,
      // props forwarded to component
      message,
      title,
      titleBackgroundClass,
      titleClass,
      persistent,
    }).onDismiss(() => {
      resolve()
    })
  })
}

export function warnDialogParse(errors) {
  const errorParsed = parseErrors(errors)
  const message = `Por favor, revise los siguientes campos: ${errorParsed}`
  warnDialog({ message })
}

export function getBase64FromInput(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()
    reader.onload = function() {
      // Adds name to the base64 file
      resolve(`${reader.result};name,${file.name}`)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getBase64FromUrl(url) {
  return new Promise(function(resolve, reject) {
    request({
      method: "GET",
      url,
      responseType: "blob",
    })
      .then(response => {
        const reader = new FileReader()
        reader.onload = function() {
          const fileName = lastPartOfPath(url)
          // Adds name to the base64 file
          resolve(`${reader.result};name,${fileName}`)
        }
        reader.onerror = reject
        reader.readAsDataURL(response.data)
      })
      .catch(e => {
        console.log(e)
        reject(e)
      })
  })
}

export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

// Pipe & PipeWith: https://dev.to/benlesh/a-simple-explanation-of-functional-pipe-in-javascript-2hbj
export function pipe(...fns) {
  return arg => fns.reduce((prev, fn) => fn(prev), arg)
}

export function pipeWith(arg, ...fns) {
  return pipe(...fns)(arg)
}

// Convert keys to camelCase https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
const toCamel = s => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "")
  })
}
const isArray = function(a) {
  return Array.isArray(a)
}
const isObject = function(o) {
  return o === Object(o) && !isArray(o) && typeof o !== "function"
}
export const keysToCamel = function(o) {
  if (isObject(o)) {
    const n = {}

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k])
    })

    return n
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i)
    })
  }

  return o
}
