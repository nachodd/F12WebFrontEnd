import { firstWord, firstToUpper, lastPartOfPath } from "@utils/helpers"

export default async ({ Vue }) => {
  Vue.filter("firstWord", firstWord)
  Vue.filter("firstToUpper", firstToUpper)
  Vue.filter("lastPartOfPath", lastPartOfPath)
}
