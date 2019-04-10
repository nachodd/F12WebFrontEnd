import request from "../utils/request";

export default async ({ /* router, store, */ Vue }) => {
  Vue.prototype.$axios = request;
};
