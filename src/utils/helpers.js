import { Notify } from "quasar"
import { Dialog } from "quasar"
import DialogCustom from "@comp/DialogCustom"

export function firstWord(string) {
  return string.replace(/ .*/, "")
}

export function firstToUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function warn({
  message = "Hubo un problema al procesar su petición. Intente nuevamente más tarde",
  timeout = 5000,
  color = "negative",
  textColor = "white",
  icon = "warning",
  actions = [{ label: "CERRAR", color: "white" }],
}) {
  Notify.create({
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
  Notify.create({
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
          return `<li>${error}</li>`
        },
        res,
      )
      const keyToUpper = firstToUpper(key)
      return `<li><strong>${keyToUpper}</strong>: <ul>${errorsForKey}<ul></li>`
    },
    "",
  )
  return `<ul>${errorList}<ul>`
}

export function warnDialog({
  message,
  title = "Aviso",
  titleBackgroundClass = "bg-red-6",
  titleClass = "text-white",
}) {
  Dialog.create({
    component: DialogCustom,
    // props forwarded to component
    message,
    title,
    titleBackgroundClass,
    titleClass,
  })
}

export function warnDialogParse(errors) {
  const errorParsed = parseErrors(errors)
  const message = `Por favor, revise los siguientes campos: ${errorParsed}`
  warnDialog({ message })
}
