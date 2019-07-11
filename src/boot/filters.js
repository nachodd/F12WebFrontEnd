import { firstWord, firstToUpper, lastPartOfPath } from "@utils/helpers"
// import Vue2TouchEvents from "vue2-touch-events"

export default async ({ Vue }) => {
  Vue.filter("firstWord", firstWord)
  Vue.filter("firstToUpper", firstToUpper)
  Vue.filter("lastPartOfPath", lastPartOfPath)

  // Vue.use(Vue2TouchEvents)
}
