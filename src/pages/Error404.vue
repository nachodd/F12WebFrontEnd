<template>
  <div class="fixed-center text-center">
    <p>
      <img src="~assets/sad.svg" style="width:30vw;max-width:150px;" />
    </p>
    <p class="text-faded">
      <strong>(404)</strong>
      <br />
      Perdon! no hay nada que ver por aquí...
    </p>
    <q-btn
      color="deep-purple-10"
      style="width:200px;"
      @click="$router.push('/')"
    >
      Volver
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "Error404",
}
</script>
