import mixin from '@/mixins'
import axios from 'axios'
import router from '../router'
const Swal = require('sweetalert2')
const state = {
    token: null,
    refreshToken: null,
    USER_SELECTED_COMPANY: null,
    PERMISSIONS: [],
    AUTH_HEADER: '',
    MODULE_PERMISSION: null,
    USER_DATA: {
        user_id: '',
        phone: '',
        email: '',
        last_name: '',
        first_name: '',
        username: ''
    }
}

const getters = {
    authToken: state => state.token,
    authRefreshToken: state => state.refreshToken,
    authUserData: state => state.USER_DATA,
    authPermissions: state => state.PERMISSIONS,
    authModulePermission: state => state.MODULE_PERMISSION,
    authUserSelectedCompany: state => state.USER_SELECTED_COMPANY,
    authHeader: state => state.AUTH_HEADER
}

const actions = {
    async authLogin({ commit, dispatch }, user) {
        dispatch('showCircularPreloader', true)
        const superUser = user.super
        const title = user.title
        try {
            const response = await axios.post(window.resourceSrv + `api/token/`, user)

            user = response.data.data.userData
            const token = response.data.data.access
            const refreshToken = response.data.data.refresh
            const permissions = response.data.data.permissions
            user.super = superUser
            user.title = title

            localStorage.setItem('userData', JSON.stringify(user))
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('permissions', JSON.stringify(permissions))

            dispatch('authAddToken', token)
            dispatch('authAddUser', user)
            dispatch('authAddPermissions', permissions)
            dispatch("addAllowedCompanies", permissions)
            dispatch('authAddUserSelectedCompany', permissions.company[0])

            dispatch('fetchModules')
            dispatch('showCircularPreloader', false)

        } catch (error) {
            dispatch('showCircularPreloader', false)
            console.log(error)
            if (!error.response) {
                Swal.fire({
                    type: 'error',
                    title: 'Error de comunicación con el servidor',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (error.response.status === 401) {
                Swal.fire({
                    type: 'error',
                    title: 'Credenciales invalidas!',
                    text: 'Usuario o contraseña incorrectos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    },
    authAddToken({ commit, dispatch }, token) {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        commit('setRequestAuth', header)
        commit('token', token)
        dispatch('authTimer', header)
    },

    authTimer({ commit, dispatch }, header) {

        setInterval(myNotification, 60000);

        async function myNotification() {
            var token = localStorage.getItem("refreshToken");
            var refresh = {
                refresh: token
            }

            const response = await axios.post(window.resourceSrv + `api/token/refresh/`, refresh)
            localStorage.setItem('token', response.data.access)
            const header = {
                headers: {
                    Authorization: `Bearer ${response.data.access}`
                }
            }
            commit('setRequestAuth', header)
            commit('token', response.data.access)
        }
    },

    authAddUser({ commit, dispatch }, user) {
        commit('setUserData', user)
    },
    authAddPermissions({ commit }, permissions) {
        commit('setUserPermissions', permissions)
    },
    //* **********************************[  PERMISSIONS  ]*****************************************/
    async addAuthModulePermissions({ commit, getters, dispatch }) {
        try {


            // console.log(router.history.current.fullPath)

            // await dispatch('fetchModules')

            var modules = getters.allModules

            // ESTO ESTA TIRANDO EL WARNING
            const result = modules.filter(
                module => module.route === router.history.current.fullPath
            )

            const filter = getters.authUserSelectedCompany.permissions.filter(
                permission => permission.module_id === result[0].id
            )

            localStorage.setItem('modulePermissions', JSON.stringify(filter[0]))
            await commit('setUserModulePermissions', filter[0])
            await dispatch('setPermissionsVariables', filter[0])
        } catch (error) {

        }
    },
    // async addAuthModulePermissionsReload({ commit, dispatch }, permissions) {
    //     await commit('setUserModulePermissions', permissions)
    //* ********Refresco Sidebar******** */
    // await dispatch('fetchUserPermissions')
    //* ******************************* */
    // },
    // async fetchUserPermissions({ commit, getters, dispatch }) {
    //     try {
    //         const response = await axios.get(
    //             window.resourceSrv +
    //             `permisos_de_usuario/${getters.authUserData.user_id}`,
    //             getters.authHeader
    //         )

    //         var result = response.data.data.company.filter(
    //             company => company.id === getters.authUserSelectedCompany.id
    //         )

    //         // Le coloco en el sidebar el primer valor
    //         await dispatch('authAddUserSelectedCompany', result[0])
    //         // await dispatch('authAddPermissions', response.data.data)
    //         await commit('setUserPermissions', response.data.data)
    //         dispatch("addAllowedCompanies", response.data.data)
    //         await dispatch('addAuthModulePermissions')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    //* *************************************************************************************/
    async authAddUserSelectedCompany({ commit, dispatch, getters }, selected) {

        dispatch('resetCompanyState')
        dispatch('resetCreditorState')
        dispatch('resetDiscountState')
            // dispatch('resetEmployeeState')
        dispatch('resetModuleState')
        dispatch('resetRoleState')
        dispatch('resetUserState')
        dispatch('resetCalcReportState')
            // dispatch('resetEmployeeState')

        if (selected.permissions.length <= 0) {
            selected.permissions = getters.defaultModulePermissions
        }

        localStorage.setItem('selectedCompany', JSON.stringify(selected))

        commit('setUserSelectedCompany', selected)
        dispatch('showCircularPreloader', true)
        setTimeout(async function() {
            // ACA DEBO COLOCAR TODOS LOS FILTROS
            await dispatch('fetchAllUsers')
            await dispatch('fetchAllCreditors')
            await dispatch('fetchRoles')
                // await dispatch('fetchEmployees')
                // await dispatch('fetchAllDiscounts')
                // await dispatch('addAuthModulePermissions')

            dispatch('showCircularPreloader', false)
        }, 2000)
    },
    authLogoutUser({ commit, dispatch }) {

        localStorage.clear()
        dispatch('showCircularPreloader', false)
        commit('sessionDestroy')
        router.push('/')
    },
}

const mutations = {
    setRefreshToken: (state, token) => (state.refreshToken = token),
    token: (state, token) => (state.token = token),
    setUserData: (state, user) => (state.USER_DATA = user),
    sessionDestroy: state => (
        (state.USER_DATA = null), (state.AUTH_HEADER = null), (state.token = null)
    ),
    setUserPermissions: (state, permissions) => (state.PERMISSIONS = permissions),
    setUserModulePermissions: (state, permissions) =>
        (state.MODULE_PERMISSION = permissions),
    setUserSelectedCompany: (state, selected) =>
        (state.USER_SELECTED_COMPANY = selected),
    setRequestAuth: (state, header) => (state.AUTH_HEADER = header)
}

export default {
    state,
    getters,
    actions,
    mutations
}