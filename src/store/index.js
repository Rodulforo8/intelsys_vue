import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import global from './global'
import permissions from './permissions'
import users from './modules/users'
import roles from './modules/roles'
import modules from './modules/modules'
import projects from './modules/projects'
import employees from './modules/employee'
import creditors from './modules/creditors'
import companies from './modules/companies'
import calcReport from './modules/calcReport'
import audits from './modules/audits'
import discounts from './modules/discounts'
import userCompany from './modules/userCompany'
import reportEmployee from './modules/reportEmployee'
import reportCreditor from './modules/reportCreditor'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    companies,
    projects,
    creditors,
    roles,
    global,
    users,
    employees,
    modules,
    discounts,
    audits,
    calcReport,
    userCompany,
    reportEmployee,
    permissions,
    reportCreditor
  }
})
