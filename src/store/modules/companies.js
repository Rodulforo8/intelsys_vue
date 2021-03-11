/**
 * Estado del modulo de compañías
 */
import mixin from '@/mixins'
import axios from 'axios'
const Swal = require('sweetalert2')

const state = {
    audit: {
        module: 'Crear compañía'
    },
    companies: [],
    company: {
        id: '',
        cnamecia: '',
        cnameagru: '',
        cidentificador: '',
        cemail: '',
        ctelefono: '',
        ccelular: '',
        cfecsaldo: '',
        cpais_id: '',
        cprovincia_id: '',
        cdireccion: '',
        apartado: '',
        cstatus: 'A',
        cnota: '',
        cx: 0.0,
        cy: 0.0,
        proyectos: [],
        roles: []
    },
    groups: [],
    companyUser: {
        first_name: '',
        last_name: '',
        password: '',
        companies: [],
        groups: ''
    },
    showCompanyForm: false,
    updating: false,
    companyDefaultRoles: ''
}

const getters = {
    allCompanies: state => state.companies,
    companyUser: state => state.companyUser,
    allActiveCompanies: state =>
        state.companies.filter(company => company.cstatus === 'A'),
    oneCompany: state => state.company,
    updatingCompany: state => state.updating,
    showCompanyForm: state => state.showCompanyForm,
    defaultRoles: state => state.companyDefaultRoles
}

const actions = {
    //* *************************************[  GET  ]***************************************** */
    async fetchAllCompanies({ commit, getters }) {
        commit('setdataTableLoader', true)
        try {

            const response = await axios.get(window.resourceSrv + 'company/', getters.authHeader)
            const roles = await axios.get(window.resourceSrv + 'system_roles/', getters.authHeader)

            commit('setDefaultRoles', roles.data.data)
            var array = []
            for (var i in response.data.data) {
                if (response.data.data[i].proyectos === null) {
                    response.data.data[i].proyectos = []
                    array.push(response.data.data[i])
                } else {
                    array.push(response.data.data[i])
                }
            }

            commit('setCompanies', array)
            commit('setdataTableLoader', false)
        } catch (error) {
            commit('setdataTableLoader', false)
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'Error de comunicacion con el servidor (company)',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },

    //* *************************************[  POST  ]***************************************** */
    async createCompany({ commit, dispatch, getters }) {
        state.audit.action = 'Creó la compañía ' + state.company.cnamecia
        dispatch('showCircularPreloader', true)

        try {

            const response = await axios.post(
                window.resourceSrv + 'company/',
                state.company, getters.authHeader
            )

            response.data.data.proyectos = []
                // response.data.data.user_id = response.data.data.id

            // SUPER USER TO THE COMPANY
            var bodyFormData = new FormData()

            bodyFormData.set('user_id', getters.authUserData.user_id)
            bodyFormData.set('company_id', response.data.data.id)


            await axios.post(
                window.resourceSrv + `company_user/`,
                bodyFormData, getters.authHeader
            )

            const response2 = await axios.get(window.resourceSrv + `company/${response.data.data.id}`, getters.authHeader)

            // CREO EL USUARIO 
            state.companyUser.groups = 1

            state.companyUser.companies.push(response.data.data.id)

            const response3 = await axios.post(
                window.resourceSrv + 'usuario/',
                state.companyUser, getters.authHeader
            )


            //* ********Refresco Sidebar******** */
            dispatch('fetchUserPermissions')
                //* ******************************* */
            commit('setCompany', response2.data.data)
            commit('setUpdatingCompanyStatus', true)
            commit('setUpdatingCompanyData', response2.data.data)
            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
            Swal.fire({
                type: 'success',
                title: 'Compañía creada exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            console.log(error)
            console.log("gasda")

            if (error.status === 400) {
                Swal.fire({
                    type: 'error',
                    title: 'Registro encontrado!',
                    text: ' Ya existe una compañía con ese nombre o email',
                    showConfirmButton: false,
                    timer: 4000
                })
            }
        }
    },
    //* ************************************[  PATCH  ]***************************************** */
    async updateCompany({ commit, dispatch, getters }) {
        state.audit.action = 'Actualizó la compañía ' + state.company.cnamecia
        dispatch('showCircularPreloader', true)
        try {
            // if (state.company.cstatus) {
            //   state.company.cstatus = 'A'
            // } else {
            //   state.company.cstatus = 'I'
            // }

            await axios.patch(
                window.resourceSrv + `
                company / $ { state.company.id }
                /`,
                state.company, getters.authHeader
            )

            // if (state.company.cstatus === 'I') {
            //   state.company.cstatus = false
            // } else if (state.company.sctatus === 'A') {
            //   state.company.cstatus = true
            // }

            var index = state.companies.indexOf(state.company)

            commit('setUpdatedCompany', index)
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'success',
                title: 'Actualizado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            dispatch('showCircularPreloader', false)
            Swal.fire({
                type: 'error',
                title: 'error',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    //* ************************************[  DELETE  ]***************************************** */
    async deleteCompany({ commit, dispatch, getters }) {
        state.audit.action = 'Eliminó la compañía ' + state.company.cnamecia
        dispatch('showCircularPreloader', true)
        try {
            if (state.company.proyectos.length > 0) {
                dispatch('showCircularPreloader', false)
                dispatch('fetchUserPermissions')
                Swal.fire({
                    type: 'error',
                    title: 'La compañía posee proyectos asociados.',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                await axios.delete(window.resourceSrv + `company/${state.company.id}/`, getters.authHeader)
                commit('setDeletedCompany', state.company)

                Swal.fire({
                        type: 'success',
                        title: 'La compañía fue eliminada exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    //* ********Refresco Sidebar******** */
                await dispatch('fetchUserPermissions')
                    //* ******************************* */
                await dispatch('resetCompanyState')
                await dispatch('showCircularPreloader', false)
                await dispatch('auditLog', state.audit)

            }
        } catch (error) {
            dispatch('showCircularPreloader', false)
            console.log(error)
            Swal.fire({
                type: 'error',
                title: 'error',
                showConfirmButton: false,
                timer: 1500
            })
        }
    },
    updatingCompanyData({ commit }, company) {
        commit('setUpdatingCompanyData', company)
        commit('setUpdatingCompanyStatus', true)
        commit('setShowCompanyForm', true)
    },
    renderCompanyForm({ commit }, boolean) {
        commit('setShowCompanyForm', boolean)
    },
    resetCompanyState({ commit, dispatch }) {
        // dispatch('fetchAllCompanies')
        commit('setCompanyState')
        commit('setShowCompanyForm', false)
        commit('setUpdatingCompanyStatus', false)
        dispatch('resetProvinces')
    },
    resetCompaniesState({ commit }) {
        commit('setCompanies', [])
    }
}

const mutations = {
    setUpdatingCompanyStatus: (state, boolean) => (state.updating = boolean),
    setCompanies: (state, companies) => (state.companies = companies),
    setCompany: (state, company) => state.companies.push(company),
    setUpdatingCompanyData: (state, company) => (state.company = company),
    setUpdatedCompany: (state, index) =>
        Object.assign(state.companies[index], state.company),
    setDeletedCompany: (state, deletedCompany) =>
        (state.companies = state.companies.filter(
            company => company.id !== deletedCompany.id
        )),
    setShowCompanyForm: (state, boolean) => (state.showCompanyForm = boolean),
    setCompanyState: state =>
        (state.company = {
                id: '',
                cnamecia: '',
                cnameagru: '',
                cidentificador: '',
                cemail: '',
                ctelefono: '',
                ccelular: '',
                cfecsaldo: '',
                cpais_id: '',
                cprovincia_id: '',
                cdireccion: '',
                apartado: '',
                cstatus: 'A',
                cnota: '',
                cx: 0.0,
                cy: 0.0,
                proyectos: [],
                roles: []
            },
            state.companyUser = {
                first_name: '',
                last_name: '',
                password: '',
                companies: [],
                groups: ''
            }),
    setNewProject: (state, project) => state.company.proyectos.push(project),
    setUpdatedProject: (state, project) =>
        Object.assign(state.company.proyectos[project.index], project),
    setDeletedProject: (state, index) => state.company.proyectos.splice(index, 1),
    setDefaultRoles: (state, roles) => state.companyDefaultRoles = roles
}

export default {
    state,
    getters,
    actions,
    mutations
}