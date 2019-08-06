<template functional>
  <div class="shadow-3 bg-grey-2 rounded-borders req-container__col">
    <div class="bg-deep-purple-10 card-header rounded-borders-8">
      {{ props.title }}
    </div>
    <!-- <q-slide-transition> -->
    <template v-if="!props.loadingList">
      <div class="req-container">
        <slot />
      </div>
    </template>
    <!-- </q-slide-transition> -->
    <div v-if="props.loadingList" class="row text-center loading-container">
      <div class="col self-center">
        <q-spinner-gears size="50px" color="accent" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListRequerimientos",
  props: {
    title: {
      type: String,
      default: "",
    },
    loadingList: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.loading-container {
  min-height: 100px;
}
.card-header {
  text-align: center;
  font-size: 1.2rem;
  color: #fff;
  width: 90%;
  position: relative;
  top: -20px;
  box-shadow: inherit;
  margin: 0 auto;
  padding: 5px;
}
.req-container {
  position: relative;
  top: -10px;
  height: 95%;
}
</style>
