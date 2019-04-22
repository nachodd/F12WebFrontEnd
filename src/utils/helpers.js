export function firstWord(string) {
  return string.replace(/ .*/, "")
}

export default {
  firstToUpper: string => string.charAt(0).toUpperCase() + string.slice(1),
}
