import { date } from "quasar"

export default class Notificacion {
  constructor(notif = {}) {
    this.id = notif.notification_id ? notif.notification_id : null

    this._read_at = notif.notification_read_at
      ? notif.notification_read_at
      : null
    // this.read_at_date = notif.notification_read_at
    //   ? new Date(notif.notification_read_at)
    //   : null

    this.read_at =
      notif.notification_read_at && date.isValid(notif.notification_read_at)
        ? date.formatDate(notif.notification_read_at, "HH:mm DD/MM")
        : null

    this._created_at = notif.notification_created_at
      ? notif.notification_created_at
      : null
    // this.created_at_date = notif.notification_created_at
    //   ? new Date(notif.notification_created_at)
    //   : null
    this.created_at =
      notif.notification_created_at &&
      date.isValid(notif.notification_created_at)
        ? date.formatDate(notif.notification_created_at, "HH:mm DD/MM")
        : null

    this.type = notif.notification_type ? notif.notification_type : null
    this.message = notif.notification_message
      ? notif.notification_message
      : null
    this.requerimiento = notif.notificacion_requerimiento
      ? notif.notificacion_requerimiento
      : null
  }

  get leida() {
    return this.read_at !== null
  }
}
