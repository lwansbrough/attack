<template>
  <div class="container">
    <MainNavigation />
    <router-view/>
  </div>
</template>

<script>
import MainNavigation from '../../components/MainNavigation'

export default {
  name: 'Index',
  metaInfo () {
    return {
      title: 'Index',
      titleTemplate: '%s - Scout'
    }
  },
  components: {
    MainNavigation
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
