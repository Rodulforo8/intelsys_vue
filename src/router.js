import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import CompanyView from '@/views/CompanyView'
import RolesView from '@/views/RolesView'
import UsersAdminView from '@/views/UserAdminView'
import AuditView from '@/views/AuditView'
import DiscountView from '@/views/Resources/DiscountViews/DiscountView'
import ReportEmployeeView from '@/views/Resources/DiscountViews/ReportEmployeeView'
import ReportCreditorView from '@/views/Resources/DiscountViews/ReportCreditorView'
import CalcReportsView from '@/views/CalcReportsView'
import EmployeeView from '@/views/Resources/EmployeeView'
import CreditorView from '@/views/Resources/CreditorView'
import ModuleView from '@/views/ModulesView'
import Test from '@/components/Test'
import store from './store'
//* ***************************[ CONSTRUCTION SITE ]****************************************/
// import DiscountView from '@/components/Test'
// import EmployeeReportsView from '@/components/Test'
// import CreditorReportsView from '@/components/Test'
// import ReportsView from '@/components/Test'
//* ***************************[ CONSTRUCTION SITE ]****************************************/

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/acreedores',
      name: 'CreditorView',
      component: CreditorView
    },
    {
      path: '/crear_compañía',
      name: 'CompanyView',
      component: CompanyView,
    },
    {
      path: '/descuentos',
      name: 'DiscountView',
      component: DiscountView
    },
    {
      path: '/descuento_empleado',
      name: 'ReportEmployeeView',
      component: ReportEmployeeView
    },
    {
      path: '/descuento_acreedor',
      name: 'ReportCreditorView',
      component: ReportCreditorView
    },
    {
      path: '/reporte_de_calculo',
      name: 'CalcReportsView',
      component: CalcReportsView
    },
    {
      path: '/pruebas',
      name: 'Test',
      component: Test
    },
    {
      path: '/roles',
      name: 'RolesView',
      component: RolesView
    },
    {
      path: '/usuarios',
      name: 'UsersAdminView',
      component: UsersAdminView,
      // beforeEnter:(to, from, next) =>{
      //   store.dispatch('fetchAllUsers');
      //   store.dispatch('fetchAllCompanies');
      //   next();
      // }
    },
    {
      path: '/auditoria',
      name: 'AuditView',
      component: AuditView,
      // beforeEnter: (to, from, next) =>{
      //   store.dispatch('fetchAllAudits')
      //   next()
      // },
    },
    {
      path: '/empleados',
      name: 'EmployeeView',
      component: EmployeeView
    },
    {
      path: '/modulos',
      name: 'ModuleView',
      component: ModuleView
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
