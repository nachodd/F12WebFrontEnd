import { Notify } from "quasar"

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
