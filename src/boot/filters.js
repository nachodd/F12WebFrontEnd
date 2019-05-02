import { firstWord } from "@utils/helpers"

export default async ({ Vue }) => {
  Vue.filter("firstWord", firstWord)
}
