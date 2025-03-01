import store from "store"

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value, rolesBase = undefined) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = rolesBase || (store.getters && store.getters["auth/roles"])
    const permissionRoles = value
    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
