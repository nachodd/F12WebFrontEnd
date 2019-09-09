import { register } from "register-service-worker"
import { Dialog } from "quasar"

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready() {
    console.log("App is being served from cache by a service worker.")
  },

  registered(/* registration */) {
    console.log("Service worker has been registered.")
  },

  cached(/* registration */) {
    console.log("Content has been cached for offline use.")
  },

  updatefound(/* registration */) {
    console.log("New content is downloading.")
  },

  updated(/* registration */) {
    console.log("New content is available; please refresh.")

    const timer = setTimeout(() => {
      console.log("Refreshing automagically...")
      window.location.reload()
    }, 3000)

    Dialog.create({
      title: "AVISO",
      message: "Una nueva version esta disponible. Actualizando...",
      cancel: false,
      persistent: true,
    }).onOk(() => {
      clearTimeout(timer)
      window.location.reload()
    })
  },

  offline() {
    console.log("No internet connection found. App is running in offline mode.")
  },

  error(err) {
    console.error("Error during service worker registration:", err)
  },
})
