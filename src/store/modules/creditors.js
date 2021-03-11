import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
    audit: {
        module: 'Acreedores'
    },
    creditors: [],
    creditor: {
        id: '',
        acnameacree: '',
        status: ''
    },
    showCreditorForm: false,
    updating: false
}

const getters = {
    allCreditors: state => state.creditors,
    oneCreditor: state => state.creditor,
    showCreditorForm: state => state.showCreditorForm,
    updatingCreditor: state => state.updating
}

const actions = {
    //* *************************************[  GET  ]***************************************** */
    async fetchAllCreditors({ commit, getters }) {
        commit('setdataTableLoader', true)

        try {

            const response = await axios.get(
                window.resourceSrv +
                `acreedores_por_compania/${getters.authUserSelectedCompany.id}`,
                getters.authHeader
            )

            if (response.data.data === null) {
                response.data.data = []
            }

            commit('setCreditors', response.data.data)
            commit('setdataTableLoader', false)
        } catch (error) {
            commit('setdataTableLoader', false)
            console.log(error);

        }
    },
    //* *************************************[  POST  ]***************************************** */
    async createCreditor({ commit, dispatch, getters }) {
        state.audit.action = 'Creó el acreedor ' + state.creditor.acnameacree
        dispatch('showCircularPreloader', true)
        try {
            state.creditor.company_id = getters.authUserSelectedCompany.id
            const response = await axios.post(
                window.resourceSrv + 'acreedor/',
                state.creditor,
                getters.authHeader
            )
            commit('setCreditor', response.data.data)
            dispatch('updatingCreditorData', response.data.data)
            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
            dispatch('resetCreditorState')
            Swal.fire({
                type: 'success',
                title: 'El acreedor fue creado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'ERROR',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* *************************************[  PATCH  ]***************************************** */
    async updateCreditor({ commit, dispatch, getters }) {
        state.audit.action = 'Actualizó el acreedor ' + state.creditor.acnameacree
        dispatch('showCircularPreloader', true)
        try {
            const response = await axios.patch(
                window.resourceSrv + `acreedor/${state.creditor.id}/`,
                state.creditor,
                getters.authHeader
            )

            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
            dispatch('resetCreditorState')
            Swal.fire({
                type: 'success',
                title: 'El acreedor fue actualizado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'ERROR',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* *************************************[  DELETE  ]***************************************** */
    async deleteCreditor({ commit, dispatch, getters }) {
        state.audit.action = 'Eliminó el acreedor ' + state.creditor.acnameacree
        dispatch('showCircularPreloader', true)
        try {
            await axios.delete(
                window.resourceSrv + `acreedor/${state.creditor.id}/`,
                getters.authHeader
            )
            dispatch('showCircularPreloader', false)
            dispatch('resetCreditorState')
            dispatch('auditLog', state.audit)
            Swal.fire({
                type: 'success',
                title: 'El acreedor fue eliminado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'ERROR',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    updatingCreditorData({ commit }, creditor) {
        commit('setUpdatingCreditorData', creditor)
        commit('setUpdatingCreditorStatus', true)
        commit('setShowCreditorForm', true)
    },
    renderCreditorForm({ commit }, boolean) {
        commit('setShowCreditorForm', boolean)
    },
    resetCreditorState({ commit, dispatch }) {
        dispatch('fetchAllCreditors')
        commit('setShowCreditorForm', false)
        commit('resetCreditor')
        commit('setUpdatingCreditorStatus', false)
    }
}

const mutations = {
    setCreditors: (state, creditors) => (state.creditors = creditors),
    setCreditor: (state, creditor) => state.creditors.push(creditor),
    setUpdatingCreditorData: (state, creditor) => (state.creditor = creditor),
    setDiscountView: (state, boolean) => (state.showDiscountForm = boolean),
    setShowCreditorForm: (state, boolean) => (state.showCreditorForm = boolean),
    setUpdatingCreditorStatus: (state, boolean) => (state.updating = boolean),
    resetCreditor: state =>
        (state.creditor = {
            id: '',
            acnameacree: '',
            status: ''
        })
}

export default {
    state,
    getters,
    actions,
    mutations
}