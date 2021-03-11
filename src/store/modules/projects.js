/**
 * Estado projectos
 */
import axios from 'axios'
const Swal = require('sweetalert2')
const state = {
    audit: {
        module: 'Crear proyecto'
    },
    projects: [],
    projectProvinces: [],
    project: {
        id: '',
        compania: '',
        pais_id: '',
        pais: '',
        provincia_id: '',
        provincia: '',
        proestatus: 'A',
        pdireccion: '',
        px: '',
        py: '',
        company_id: '',
        nameproy: ''
    },
    activeCompanyProjects: [],
    projectProvinceLoader: false
}

const getters = {
    oneProject: state => state.project,
    allProjects: state => state.projects,
    projectProvinces: state => state.projectProvinces,
    projectProvinceLoader: state => state.projectProvinceLoader,
    activeCompanyProjects: state => state.activeCompanyProjects
}

const actions = {
    //* ****************************************[ GET PROYECT ]*************************************************/
    async fetchProject({ commit, getters }, id) {
        try {
            const response = await axios.get(
                window.resourceSrv + `proyecto/${id}`, getters.authHeader
            )
            commit('setOneProyect', response.data.data)

        } catch (error) {
            console.log(error)

        }
    },
    //* ****************************************[ GET PROVINCES ]*************************************************/
    async fetchProjectProvinces({ commit, getters }, id) {
        commit('setProjectProvinceLoader', true)
        try {
            const response = await axios.get(
                window.resourceSrv + `obtener_provincias_por_pais/${id}`, getters.authHeader
            )
            commit('setProjectProvinces', response.data.data.provincias)
            commit('setProjectProvinceLoader', false)
        } catch (error) {
            console.log(error)
            commit('setProjectProvinceLoader', false)
        }
    },
    //* ************************************[ GET COMPANY PROJECTS ]********************************************/
    async fetchProjectsOfCompany({ commit, getters }) {
        try {
            const response = await axios.get(
                window.resourceSrv +
                `proyectos_por_compania/${getters.authUserSelectedCompany.id}`, getters.authHeader
            )

            commit('setActiveCompanyProjects', response.data.data)
        } catch (error) {
            console.log(error)
            commit('setProjectProvinceLoader', false)
        }
    },
    async fetchLocalizedProjectsOfCompany({ commit, getters, dispatch }, id) {
        dispatch('setEmployeeProyectLoader', true)
        try {
            const response = await axios.get(
                window.resourceSrv +
                `proyectos_por_compania/${id}`, getters.authHeader
            )

            commit('setActiveCompanyProjects', response.data.data)
            dispatch('setEmployeeProyectLoader', false)
        } catch (error) {
            console.log(error)
            dispatch('setEmployeeProyectLoader', false)
            commit('setProjectProvinceLoader', false)
        }
    },
    //* *******************************************[ POST ]****************************************************/
    async createProject({ commit, dispatch, getters }, project) {
        state.audit.action = 'Creó el proyecto ' + project.nameproy
        project.company_id = parseInt(getters.oneCompany.id)
        dispatch('showCircularPreloader', true)
        try {
            const response = await axios.post(
                window.resourceSrv + `proyecto/`,
                project, getters.authHeader
            )

            commit('setNewProject', response.data.data)
            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
            Swal.fire({
                type: 'success',
                title: 'El proyecto fue creado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
        }
    },
    //* *******************************************[ PATCH ]****************************************************/
    async updateProject({ commit, dispatch, getters }, project) {
        state.audit.action = 'Actualizó el proyecto ' + project.nameproy
        dispatch('showCircularPreloader', true)
        try {
            await axios.patch(window.resourceSrv + `proyecto/${project.id}/`, project, getters.authHeader)

            commit('setUpdatedProject', project)
            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
        }
    },
    //* *******************************************[ DELETE ]***************************************************/
    async deleteProject({ commit, dispatch, getters }, project) {
        state.audit.action = 'Eliminó el proyecto ' + project.nameproy
        dispatch('showCircularPreloader', true)
        try {
            await axios.delete(window.resourceSrv + `proyecto/${project.id}`, getters.authHeader)

            commit('setDeletedProject', project.index)

            dispatch('showCircularPreloader', false)
            dispatch('auditLog', state.audit)
            Swal.fire({
                type: 'success',
                title: 'El proyecto fue eliminado exitosamente!',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            dispatch('showCircularPreloader', false)
        }
    },
    // setProjects ({ commit }, projects) {
    //   commit('setProjects', projects)
    // }
    resetCompanyProjects({ commit }) {
        commit('setActiveCompanyProjects', [])
    }
}

const mutations = {
    setOneProyect: (state, project) => (state.project = project),
    setProjectProvinces: (state, provinces) =>
        (state.projectProvinces = provinces),
    setProjects: (state, projects) => (state.projects = projects),
    setProjectProvinceLoader: (state, boolean) =>
        (state.projectProvinceLoader = boolean),
    setActiveCompanyProjects: (state, projects) =>
        (state.activeCompanyProjects = projects)
}

export default {
    state,
    getters,
    actions,
    mutations
}