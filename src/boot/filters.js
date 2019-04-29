import { firstWord } from "src/utils/helpers"

export default async ({ Vue }) => {
  Vue.filter("firstWord", firstWord)
}
