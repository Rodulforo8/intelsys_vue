<template>
  <v-container>
    <!-- {{oneCreditor}} -->
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showCreditorForm"
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
            <span>Buscar acreedor</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="create"
                @click="renderForm()"
                v-on="on"
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
            <span>Crear acreedor</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="update"
                id="action-btn"
                v-on="on"
                @click="save()"
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
                id="action-btn"
                v-if="deletes"
                v-on="on"
                @click="delCreditor()"
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
            <span>Eliminar acreedor</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!------------------------------------------[ SEARCH USERS ]------------------------------------------->
      <transition name="slide-fade">
        <CreditorSearch v-if="!showCreditorForm" :fieldColor="fieldColor"/>
      </transition>
      <!---------------------------------------[ CREATE/EDIT CREDITOR ]----------------------------------------->
      <transition name="slide-fade">
        <CreditorForm v-if="showCreditorForm" :fieldColor="fieldColor"/>
      </transition>
    </v-row>
  </v-container>
</template>
<script>
import CreditorSearch from "@/components/Resources/CreditorComponents/CreditorSearch";
import CreditorForm from "@/components/Resources/CreditorComponents/CreditorForm";
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  components: {
    CreditorSearch,
    CreditorForm
  },
  data() {
    return {
      fieldColor: "#1c6255",
      fieldColor: "#1c6255",
      creationText: "Esta seguro, quiere salir de la creacion de acreedor? ",
      updatingText: "Esta seguro, quiere salir de la edición de acreedor? ",
      deleteText: "Esta seguro que desea borrar la compañía? : "
    };
  },
  beforeDestroy() {
    this.resetCreditorState();
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
    this.fetchAllCreditors();
  },
  computed: {
    ...mapGetters([
      "showCreditorForm",
      "allCreditors",
      "updatingCreditor",
      "oneCreditor",
      "authModulePermission",
      "authUserData"
    ]),
    create: function() {
      if (this.authModulePermission.create > 0 || this.authUserData.super) {
        return true;
      } else {
        return false;
      }
    },
    update: function() {
      if (
        (this.showCreditorForm && this.authModulePermission.update > 0) ||
        this.authUserData.super
      ) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (
        (this.showCreditorForm && this.authModulePermission.delete > 0) ||
        this.authUserData.super
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions([
      "renderCreditorForm",
      "fetchAllCreditors",
      "resetCreditorState",
      "deleteCreditor",
      "addAuthModulePermissions"
    ]),
    save() {
      this.$bus.emit("submitCreditorFrom");
    },
    renderForm() {
      this.renderCreditorForm(true);
    },
    renderSearch() {
      var text = this.updatingCreditor ? this.updatingText : this.creationText;
      if (this.showCreditorForm) {
        Swal.fire({
          title: text,
          text: "Los datos seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetCreditorState();
          }
        });
      }
    },
    delCreditor() {
      var text = this.updatingCreditor
        ? this.deleteText + this.oneCreditor.acnameacree
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
          this.updatingCreditor
            ? this.deleteCreditor()
            : this.resetCreditorState();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
#top-step-counter {
  position: absolute;
  text-align: right;
  color: #113d4c;
}
</style>


