import { mapGetters, mapActions } from 'vuex'
import Swal from 'sweetalert2'
import moment from 'moment-timezone'
export default {
    data() {
        return {
            storageUser: null,
            token: null,
            refresh: null,
            myVar: '',
            users: [],
            rules: {
                limit: v => (v && v <= 9) || 'Valor invalido',
                year: v => (v && v.length >= 4) || 'Año invalido',
                month: v => (v && v <= 12) || 'Mes invalido',
                day: v => (v && v <= 31) || 'Dia invalido',
                required: value => !!value || 'Campo requerido.',
                email: value => /.+@.+/.test(value) || 'Email invalido',
                passwordLength: v =>
                    (v && v.length >= 10) || 'Debe de tener almenos 10 caracteres',
                passwordUpperCase: v =>
                    /(?=.*[A-Z])/.test(v) || 'Debe tener una letra mayuscula',
                passwordNumber: v => /(?=.*\d)/.test(v) || 'Debe tener un numero',
                passwordSpecialChar: v =>
                    /([!@$%#])/.test(v) || 'Debe tener un caracter especial[!@#$%]'
                    // :rules="[[v => !!v || "Password is required"], (this.password === this.confirmPassword) || 'Password must match']"
            }
        }
    },
    created() {
        this.storageUser = JSON.parse(window.localStorage.getItem('user_data'))
        this.token = window.localStorage.getItem('token')


    },
    computed: {
        ...mapGetters(['authToken']),
        authorizationConfig: function() {
            var data = {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            }
            return data
        }
    },

    methods: {
        ...mapActions(['setFormattedModuleData']),
        upperCaseString(str) {
            var splitStr = str.toLowerCase().split(' ')
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] =
                    splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
            }
            return splitStr.join(' ')
        },
        // token() {
        //     return this.token
        // },
        logout() {
            clearInterval(this.myVar)
            localStorage.clear()
        },
        constructModuleFormat(modules) {
            var parent = []
            var child = []

            for (var i = 0; i < modules.length; i++) {
                modules[i] = {...modules[i], child: [] }
                if (modules[i].dependencia === 0) {
                    parent.push(modules[i])
                } else {
                    child.push(modules[i])
                }
            }

            var finalArray = []

            for (var i = 0; i < parent.length; i++) {
                for (var j = 0; j < child.length; j++) {
                    if (child[j].dependencia === parent[i].id) {
                        parent[i].child.push(child[j])
                    } else {
                        for (var x = 0; x < parent[i].child.length; x++) {
                            if (child[j].dependencia === parent[i].child[x].id) {
                                parent[i].child[x].child.push(child[j])
                            }
                        }
                    }
                }
                finalArray.push(parent[i])
            }

            return finalArray
        },
        checkAuth() {
            if (!this.token) {
                Swal.fire({
                    type: 'warning',
                    title: 'Debes autenticarte primero!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.$router.push('/')
            }
        },
        getFinalDate(initDate, paymentTime) {
            var finalDate = ''
            var check = moment(initDate, 'DD/MM/YY')
            var month = check.format('M')
            var day = check.format('D')

            if (paymentTime === 'S') {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(6, 'days')
            } else if (paymentTime === '4S') {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(27, 'days')
            } else if (paymentTime === '2S') {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(13, 'days')
            } else if (paymentTime === 'M' && (month === '2' || month === '02')) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(27, 'days')
            } else if (
                paymentTime === 'M' &&
                (['06', '04', '09', '11'].indexOf(month) > -1 || ['6', '4', '9', '11'].indexOf(month) > -1)
            ) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(29, 'days')
            } else if (
                paymentTime === 'M' &&
                (['01', '03', '05', '07', '08', '10', '12'].indexOf(month) > -1 || ['1', '3', '5', '7', '8', '10', '12'].indexOf(month) > -1)
            ) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(30, 'days')
            } else if (
                paymentTime === 'Q' &&
                (['06', '04', '09', '11'].indexOf(month) > -1 || ['6', '4', '9', '11'].indexOf(month) > -1) &&
                day > 15
            ) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(14, 'days')
            } else if (paymentTime === 'Q' && day <= 15) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(14, 'days')
            } else if (
                paymentTime === 'Q' && ['01', '03', '05', '07', '08', '10', '12'].indexOf(month) > -1 &&
                day > 15
            ) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(15, 'days')
            } else if (
                paymentTime === 'Q' &&
                (month === '02' || month === '2') &&
                day > 15
            ) {
                finalDate = moment(initDate, 'DD-MM-YYYY').add(12, 'days')
            }

            return finalDate
        },
        momentFormatter(value) {
            var date = moment(value, 'YY-MM-DD').format('DD-MM-Y')

            date = date.split('-').join('/')

            return date
        }
    },

}