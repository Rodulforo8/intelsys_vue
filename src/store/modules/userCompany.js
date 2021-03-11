import axios from 'axios'
const Swal = require('sweetalert2')
const state = {
    USER_COMPANIES: [],
    selectedCompany: null,
    userCompanies: [],
    userAllowedCompanies: [],
    userCompanyRoles: []

}

const getters = {
    authUserCompanies: state => state.USER_COMPANIES,
    selectedCompany: state => state.selectedCompany,
    userCompanies: state => state.userCompanies,
    userCompanyRoles: state => state.userCompanyRoles,
    userAllowedCompanies: state => state.userAllowedCompanies
}

const actions = {
    async fetchAuthUserCompanies({ commit, getters }) {
        try {

            const response = await axios.get(
                window.resourceSrv + `company_of_user/${getters.authUserData.user_id}`,
                getters.authHeader
            )

            commit('setFoundedUserCompanies', response.data.data)

        } catch (error) {

            console.log(error)
        }
    },
    addAllowedCompanies({ commit, getters }, data) {

        var array = [];
        for (var i in data.company) {
            var json = {
                id: data.company[i].id,
                name: data.company[i].name
            };
            array.push(json);
        }
        // console.log(array)
        commit('setAllowedCompanies', array)
    },
    selectCompany({ commit }, company) {
        commit('setSelectedCompany', company)
    }, //* **************************************************[ GET ]**************************************************************/
    async fetchAllUserCompanies({ commit, dispatch, getters }) {
        commit('setdataTableLoader', true)
        try {

            const response = await axios.get(
                window.resourceSrv + `roles_de_usuario/${getters.oneUser.user_id}/`,
                getters.authHeader,
                state.user
            )

            commit('setUserCompanies', response.data.data)
            commit('setdataTableLoader', false)
        } catch (error) {
            commit('setdataTableLoader', false)
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'ERROR DE COMUNICACION CON EL SERVIDOR',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* **************************************************[ POST ]**************************************************************/
    async createUserCompany({ commit, dispatch, getters }, payload) {
        dispatch('showCircularPreloader', true)
        try {

            // payload.company_user_id = getters.oneUser.company_user_id

            var bodyFormData = new FormData()

            bodyFormData.set('user_id', payload.user_id)
            bodyFormData.set('company_id', payload.company.id)

            const responseCompany = await axios.post(
                window.resourceSrv + `company_user/`,
                bodyFormData,
                getters.authHeader
            )

            // console.log(responseCompany.data.data)

            var newCompany = {
                id: responseCompany.data.data.company_id,
                name: payload.company.name,
                company_user_id: responseCompany.data.data.id,
                roles: []
            }


            //   payload.company_user_id = responseCompany.data.data.id
            //   payload.status = 0

            // await axios.post(
            //     window.resourceSrv + `usuario_roles/`,
            //     payload,
            //     getters.authHeader
            // )

            // commit('addUserCompany', newCompany)
            dispatch('fetchUserPermissions')
            dispatch('fetchAllUserCompanies')
            dispatch('fetchAuthUserCompanies')

            Swal.fire({
                type: 'success',
                title: 'Compañía asignada exitosamente',
                showConfirmButton: false,
                timer: 3000
            })
            dispatch('showCircularPreloader', false)
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Error de comunicacion con el servidor',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    async createUserCompanyRole({ commit, dispatch, getters }, payload) {
        dispatch('showCircularPreloader', true)
        try {

            payload.role_id = payload.id
            payload.role_name = payload.nombre
            payload.status = 0

            const response = await axios.post(
                window.resourceSrv + `usuario_roles/`,
                payload,
                getters.authHeader
            )

            // console.log(response)

            payload.company_user_role_id = response.data.data.id

            commit('setNewUserRole', payload)
            dispatch('fetchUserPermissions')
            dispatch('fetchAllUserCompanies')
            dispatch('fetchAuthUserCompanies')

            Swal.fire({
                type: 'success',
                title: 'Rol asignado exitosamente',
                showConfirmButton: false,
                timer: 3000
            })
            dispatch('showCircularPreloader', false)
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'Error de comunicacion con el servidor',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* ***********************************************[DELETE]**************************************************/
    async deleteUserCompanyRole({ commit, dispatch, getters }, payload) {

        dispatch('showCircularPreloader', true)

        try {

            const reponse = await axios.delete(
                window.resourceSrv + `usuario_roles/${payload.id}`,
                getters.authHeader
            )

            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Permiso eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            })

            commit('removeUserRole', payload.role_id)
            dispatch('showCircularPreloader', false)
            dispatch('fetchUserPermissions')
            dispatch('fetchAllUserCompanies')
            dispatch('fetchAuthUserCompanies')
        } catch (error) {
            console.log('ERROR')
            console.log(error)
            dispatch('showCircularPreloader', false)
        }
    },
    addUserCompanyRoles({ commit }, data) {
        commit('setUserCompanyRoles', data)
    }
}

const mutations = {
    setSelectedCompany: (state, company) => (state.selectedCompany = company),
    setFoundedUserCompanies: (state, companies) =>
        (state.USER_COMPANIES = companies),
    setUserCompanies: (state, data) => (state.userCompanies = data),
    setAllowedCompanies: (state, data) => (state.userAllowedCompanies = data),
    setUserCompanyRoles: (state, data) => (state.userCompanyRoles = data),
    setNewUserRole: (state, data) => (state.userCompanyRoles.push(data)),
    removeUserRole: (state, id) => (state.userCompanyRoles = state.userCompanyRoles.filter(role => role.role_id !== id))
        // addUserCompany:(state, data ) => (state.userCompanies.push(data))
}

export default {
    state,
    getters,
    actions,
    mutations
}