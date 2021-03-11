import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
    audit: {
        module: 'Usuarios'
    },
    users: [],
    user: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        groups: '',
        email: '',
        companies: []
    },
    showUserForm: false,
    updating: false
}

const getters = {
    showUserForm: state => state.showUserForm,
    allUsers: state => state.users,
    oneUser: state => state.user,
    updatingUser: state => state.updating
}

const actions = {
    //* *********************************************[  GET   ]******************************************************** */
    async fetchAllUsers({ commit, getters }) {
        commit('setdataTableLoader', true)
        var users
        try {

            const response = await axios.get(
                window.resourceSrv +
                `usuarios_por_compania/${getters.authUserSelectedCompany.id}/`, getters.authHeader
            )
            users = response.data.data

            commit('setUsers', users)
            commit('setdataTableLoader', false)
        } catch (error) {
            commit('setdataTableLoader', false)
            console.log(error)
        }
    },
    //* *********************************************[  CREATE   ]******************************************************** */
    async createUser({ commit, dispatch, getters }) {
        state.audit.action = 'Creó el usuario ' + state.user.username
        dispatch('showCircularPreloader', true)
        try {

            state.user.groups = 1

            const response = await axios.post(
                window.resourceSrv + 'usuario/',
                state.user, getters.authHeader
            )

            response.data.data.user_id = response.data.data.id

            // var bodyFormData = new FormData()

            // bodyFormData.set('user_id', response.data.data.id)
            // bodyFormData.set('company_id', getters.authUserSelectedCompany.id)

            // // Asignar compania
            // const responseCompany = await axios.post(
            //     window.resourceSrv + `company_user/`,
            //     bodyFormData, getters.authHeader
            // )

            commit('addUser', response.data.data)
            commit('setActiveUser', response.data.data)
            commit('setUpdatingUser', true)
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Usuario creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            if (!error.response) {
                Swal.fire({
                    type: 'error',
                    title: 'Error de comunicación con el servidor (user)!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (error.response.status === 400) {
                Swal.fire({
                    type: 'error',
                    title: 'Datos erroneos!',
                    text: ' Ya existe un usuario con ese nombre de usuario ó email ',
                    showConfirmButton: false,
                    timer: 4000
                })
            }
        }
    },
    //* *********************************************[  UPDATE   ]******************************************************** */
    async updateUser({ commit, dispatch, getters }) {
        dispatch('showCircularPreloader', true)
        state.audit.action = 'Actualizó el usuario ' + state.user.username
        try {
            await axios.patch(
                window.resourceSrv + `usuario/${state.user.user_id}/`,
                state.user, getters.authHeader
            )

            dispatch('resetUserState', false)
            dispatch('fetchAllUsers')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Usuario actualizado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            if (!error.response) {
                Swal.fire({
                    type: 'error',
                    title: 'Error de comunicación con el servidor (user)!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (error.response.status === 400) {
                Swal.fire({
                    type: 'error',
                    title: 'Datos existentes!',
                    text: ' Ya existe un usuario con ese nombre de usuario ó email ',
                    showConfirmButton: false,
                    timer: 4000
                })
            }
        }
    },
    //* *********************************************[  DELETE  ]**********************************************************/
    async deleteUser({ commit, dispatch, getters }) {
        dispatch('showCircularPreloader', true)
        state.audit.action = 'Eliminó el usuario ' + state.user.username
        try {
            await axios.delete(window.resourceSrv + `usuario/${state.user.user_id}/`, getters.authHeader)

            dispatch('resetUserState')
            dispatch('fetchAllUsers')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Usuario eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Error usuarios',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    async deleteUserCompany({ commit, dispatch, getters }, id) {
        dispatch('showCircularPreloader', true)
        state.audit.action = 'Eliminó el usuario ' + state.user.username

        try {

            await axios.delete(window.resourceSrv + `company_user/${id}/`, getters.authHeader)

            dispatch('resetUserState')
            dispatch('fetchAllUsers')
            dispatch('auditLog', state.audit)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Usuario eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Error usuarios',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    deleteUserCompanyItem({ commit }, id) {

        commit('popUserCompanyItem', id)
    },
    addUserCompanyItem({ commit }, id) {

        commit('insertUserCompanyItem', id)
    },

    //* ***********************************************[ CONTROL ]***********************************************************/
    renderUserForm({ commit }, boolean) {
        commit('renderForm', boolean)
    },
    addUserState({ commit, dispatch }, user) {
        commit('setUserState', user)
        commit('renderForm', true)
        commit('setUpdatingUser', true)
    },
    resetUserState({ commit, dispatch }) {
        // dispatch('fetchAllUsers')
        commit('resetUser')
        commit('setUpdatingUser', false)
        commit('setUserCompanies', [])
        commit('renderForm', false)
    }
}

const mutations = {
    setUsers: (state, users) => (state.users = users),
    renderForm: (state, boolean) => (state.showUserForm = boolean),
    addUser: (state, user) => state.users.push(user),
    setActiveUser: (state, user) => (state.user = user),
    resetUser: (state, user) =>
        (state.user = {
            id: '',
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            groups: '',
            email: '',
            companies: []
        }),
    setUserState: (state, user) => (state.user = user),
    setUpdatingUser: (state, boolean) => (state.updating = boolean),
    filterUser: (state, deletedUser) =>
        state.users.filter(user => user === deletedUser),
    popUserCompanyItem: (state, data) => (state.user.companies = state.user.companies.filter(id => id !== data)),
    insertUserCompanyItem: (state, id) => (state.user.companies.push(id))
}

export default {
    state,
    getters,
    actions,
    mutations
}