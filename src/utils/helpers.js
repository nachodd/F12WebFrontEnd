import { Notify } from "quasar"

export function firstWord(string) {
  return string.replace(/ .*/, "")
}

export function warn(
  message,
  defaultMessage = "Hubo un problema al procesar su petición. Intente nuevamente mas tarde",
) {
  Notify.create({
    color: "negative",
    message: message || defaultMessage,
    icon: "warning",
    position: "top-right",
  })
}

export default {
  firstToUpper: string => string.charAt(0).toUpperCase() + string.slice(1),
}
