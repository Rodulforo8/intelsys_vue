import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import Vuex from 'vuex'
import VueSweetalert2 from 'vue-sweetalert2'
import VueBus from 'vue-bus'
import Chart from 'chart.js'
import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Lingallery from 'lingallery'
import Vue2TouchEvents from 'vue2-touch-events'
import MultiFiltersPlugin from './plugins/MultiFilters'
import VueTouch from 'vue-touch'
import JsonCSV from 'vue-json-csv'
import Notifications from 'vue-notification'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import Snotify from 'vue-snotify'
import 'vue-snotify/styles/material.css'
import mixin from './mixins'
import moment from 'moment-timezone'
// import VueMoment from 'vue-moment'
export const EventBus = new Vue();
const Swal = require('sweetalert2')

Vue.use(Vuex)
Vue.use(VueBus)
Vue.use(Snotify)
Vue.use(JsonCSV)
Vue.use(VueTouch)
Vue.use(VueRouter)
Chartkick.use(Chart)
Vue.use(Notifications)
Vue.use(VueSweetalert2)
Vue.use(Vue2TouchEvents)
Vue.use(VueAxios, axios)
Vue.use(PerfectScrollbar)
Vue.use(MultiFiltersPlugin)
    // Vue.use(require('vue-moment'));
Vue.use(VueChartkick, { Chartkick })
Vue.component('downloadCsv', JsonCSV)
Vue.component('lingallery', Lingallery)
    // Vue.use(VueMoment, {
    //   moment,
    // })

axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': 'example-of-custom-header',
    Authorization: `Bearer ${window.localStorage.getItem('token')}`
}

axios.interceptors.response.use(
    response => {
        return response
    },
    function(error) {
        // Do something with response error
        if (error.response.status === 401) {
            // Swal.fire({
            //   type: 'error',
            //   title: 'Su sesion ha expirado, debe volver a logearse',
            //   showConfirmButton: false,
            //   timer: 3000
            // })
            // store.dispatch('authLogoutUser')
            // Swal.fire({
            //     type: "error",
            //     title: "Su sesion ha expirado, debe volver a logearse",
            //     text: "",
            //     confirmButtonColor: "#3085d6",
            //     cancelButtonColor: "#d33",
            //     cancelButtonText: "NO",
            //     confirmButtonText: "OK",
            //     showCancelButton: false
            // }).then(result => {
            //     if (result.value) {
            //         store.dispatch('authLogoutUser')
            //     }
            // });
        }
        // if(response.status === 200){
        //   console.log('REFRESH')
        // }

        return Promise.reject(error.response)
    }
)

Vue.config.productionTip = false
window.resourceSrv = 'http://165.22.44.163:9100/'
    // window.resourceSrv = 'http://172.16.31.101:9100/'
    // moment(String(value)).format(‘MM/DD/YYYY hh:mm’)

Vue.filter('to-upperCase', function(value) {
    return value.toUpperCase()
})

Vue.filter('format-date', function(value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm')
})

Vue.filter('format-date-latin', function(value) {
    var date = moment(value, "YY-MM-DD").format("DD-MM-Y");

    if (date === "Invalid date") {
        date = null
    }

    return date;
})

new Vue({
    // mixins: [mixin],
    Notifications,
    store,
    vuetify,
    Vue2TouchEvents,
    router,
    render: h => h(App)
}).$mount('#app')