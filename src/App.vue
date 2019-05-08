<template>
  <div id="app">
    <main role="main">
      <router-view/>
    </main>
    <footer>
      <hr>
      Attack
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  // All the initial head tags
  metaInfo () {
    return {
      title: 'Default Title',
      titleTemplate: '%s - Attack',
      meta: [
        // Required
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' }
      ],
      htmlAttrs: {
        lang: this.$i18n.locale,
        prefix: 'og: http://ogp.me/ns#'
      }
    }
  }
}
</script>

<style lang="scss">
@import './scss/global.scss';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 100vh;
  }

  > footer {
    background-color: darken($background-color, 5%);
    padding: 3rem;
  }
}
</style>
