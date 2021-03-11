import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { Ripple, Scroll } from 'vuetify/lib/directives'
import * as directives from 'vuetify/es5/directives'

Vue.use(Vuetify, {
  // components: {},
  // directives
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#ff9800',
        accent: '#607d8b',
        error: '#f44336',
        warning: '#ffc107',
        info: 'red',
        success: '#4caf50',
        intelsys: '#1c6255"'
      },
      dark: {
        success: '#4caf50',
        intelsys: '#1c6255"'
      }
    }
  }
})

export default new Vuetify({})
