import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'

Vue.use(VueI18n)

export async function createI18n ({ locale, fallbackLocale }) {
  // Create a new instance of the vue-i18n plugin and set up the default
  // properties.
  const i18n = new VueI18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    silentTranslationWarn: false,
    messages: {
      // The `en` import is a requirement.
      en: await import(/* webpackChunkName: "locale-[request]" */`@/i18n/${fallbackLocale}.json`)
    }
  })

  if (locale !== fallbackLocale) {
    // If the user has a different locale we load in their requested locale.
    // The reason behind how this works is that we do not want to include all
    // the available locales on initial load, using the import method we can,
    // with code splitting, load them in when they are required. So if the user
    // has selected Japanese, we will only download English and Japanese in theory.

    i18n.setLocaleMessage(locale, await import(/* webpackChunkName: "locale-[request]" */`@/i18n/${locale}.json`))
  }

  if (module.hot) {
    // Implements Hot reloading for our i18n files. If hot reloading is enabled,
    // and one of the json files in the i18n folder is modified, we will automatically
    // update the vue-i18n plugin with the new messages.
    var context = require.context('../../i18n', true, /^\.\/.*\.json$/)
    module.hot.accept(context.id, () => {
      i18n.setLocaleMessage(fallbackLocale, require(`@/i18n/${fallbackLocale}.json`))
      if (locale !== fallbackLocale) {
        i18n.setLocaleMessage(locale, require(`@/i18n/${locale}.json`))
      }
    })
  }

  // Set the Accept-Language header for any requests we make externally
  // to the selected locale so those API services could return text with
  // the proper localization.
  axios.defaults.headers.common['Accept-Language'] = locale

  return i18n
}
