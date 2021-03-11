<template>
  <v-container>
  
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showCompanyForm"
                id="action-btn"
                @click="renderSearch()"
                v-on="on"
                absolute
                dark
                fab
                color="amber accent-3"
              >
                <v-icon large>search</v-icon>
              </v-btn>
              <v-btn
                v-else
                id="action-btn"
                @click="renderSearch()"
                v-on="on"
                absolute
                dark
                fab
                color="amber accent-3"
              >
                <v-icon large>arrow_back</v-icon>
              </v-btn>
            </template>
            <span>Buscar compañías</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="permissionVariables.create"
                v-on="on"
                @click="renderForm()"
                absolute
                dark
                fab
                color="green"
              >
                <v-icon large>note_add</v-icon>
              </v-btn>
              <v-btn
                id="action-btn"
                v-else
                v-on="on"
                absolute
                dark
                fab
                color="light-green accent-1"
              >
                <v-icon large>note_add</v-icon>
              </v-btn>
            </template>
            <span>Crear compañía</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="update"
                @click="save()"
                v-on="on"
                absolute
                dark
                fab
                color="blue"
              >
                <v-icon large>save</v-icon>
              </v-btn>
              <v-btn v-else id="action-btn" v-on="on" absolute dark fab color="blue lighten-4">
                <v-icon large>save</v-icon>
              </v-btn>
            </template>
            <span>Guardar</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="deletes"
                id="action-btn"
                @click="delCompany()"
                v-on="on"
                absolute
                dark
                fab
                color="red"
              >
                <v-icon large>delete</v-icon>
              </v-btn>
              <v-btn v-else id="action-btn" v-on="on" absolute dark fab color="red lighten-3">
                <v-icon large>delete</v-icon>
              </v-btn>
            </template>
            <span>Eliminar registro</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <transition name="slide-fade">
        <SearchComponent v-if="!showCompanyForm" :fieldColor="fieldColor"/>
      </transition>

      <transition name="slide-fade">
        <CompanyForm v-if="showCompanyForm" :fieldColor="fieldColor"/>
      </transition>
    </v-row>
  </v-container>
</template>
<script>
import mixin from "@/mixins";
import SearchComponent from "@/components/CompanyComponents/CompanySearch";
import CompanyForm from "@/components/CompanyComponents/CompanyForm";
import { mapGetters, mapActions, mapMutations } from "vuex";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  components: {
    SearchComponent,
    CompanyForm
  },
  data() {
    return {
      fieldColor: "#1c6255",
      creationText: "Esta seguro, quiere salir de la creacion de compañía? ",
      updatingText: "Esta seguro, quiere salir de la edición de la compañía? ",
      deleteText: "Esta seguro que desea borrar la compañía? : "
    };
  },
  beforeDestroy() {
    this.resetCompanyState();
    this.resetCompaniesState();
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
    this.fetchAllCompanies()
  },
  computed: {
    ...mapGetters([
      "allCompanies",
      "updatingCompany",
      "showCompanyForm",
      "allProvinces",
      "oneCompany",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    update: function() {
      if (this.showCompanyForm && this.permissionVariables.update) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (this.showCompanyForm && this.permissionVariables.delete) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    ...mapActions([
      "fetchAllCompanies",
      "renderCompanyForm",
      "resetCompanyState",
      "deleteCompany",
      "addAuthModulePermissions",
      "resetCompaniesState",
    ]),
    renderForm() {
      this.renderCompanyForm(true);
    },
    renderSearch() {
      var text = this.updatingCompany ? this.updatingText : this.creationText;
      if (this.showCompanyForm) {
        Swal.fire({
          title: text,
          text: "Los datos no guardados seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetCompanyState();
          }
        });
      }
    },
    save() {
      this.$bus.emit("submitCompanyForm");
    },
    delCompany() {
      var text = this.updatingCompany
        ? this.deleteText + this.oneCompany.cnamecia
        : this.creationText;
      Swal.fire({
        title: text,
        text: "Los datos no guardados seran borrados",
        type: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Salir",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.updatingCompany
            ? this.deleteCompany()
            :( this.resetCompanyState(), this.fetchAllCompanies());
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

#stepper-btn-col {
  text-align: center;
}

.stepper-btn {
  margin-left: 1em;
  margin-right: 1em;
  color: white;
}

#top-step-counter {
  position: absolute;
  text-align: right;
  color: #113d4c;
}
</style>
