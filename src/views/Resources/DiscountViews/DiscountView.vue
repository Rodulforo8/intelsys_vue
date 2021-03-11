<template>
  <v-container>
<!-- {{oneDiscount}} 
<br><br>
{{updatingDiscount}} -->
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showDiscountForm"
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
            <span>Buscar descuento</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-on="on"
                @click="renderForm()"
                absolute
                v-if="permissionVariables.create"
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
            <span>Crear descuento</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="permissionVariables.update"
                id="action-btn"
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
            <span>Guardar descuento</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="permissionVariables.delete"
                @click="deleteCompany()"
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
            <span>Eliminar descuento</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-row>

    <transition name="slide-fade">
      <DiscountSearch :fieldColor="fieldColor" v-if="!showDiscountForm"/>
      <DiscountForm :fieldColor="fieldColor" v-else/>
    </transition>
  </v-container>
</template>
<script>
import DiscountForm from "@/components/Resources/Discounts/DiscountComponents/DiscountForm";
import DiscountSearch from "@/components/Resources/Discounts/DiscountComponents/DiscountSearch";
import { mapGetters, mapActions, mapMutations } from "vuex";
import mixin from "@/mixins";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  components: {
    DiscountForm,
    DiscountSearch
  },
  data() {
    return {
      fieldColor: "#1c6255",
      showForm: true,
      showSearch: false
    };
  },
  beforeDestroy() {
    this.resetDiscountState();
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
  },
  computed: {
    ...mapGetters([
      "showDiscountForm",
      "authModulePermission",
      "permissionVariables",
      "oneDiscount",
      "allDeductionTypes",
      "updatingDiscount"
    ])
  },
  methods: {
    ...mapActions([
      "changeDiscountView",
      "addAuthModulePermissions",
      "resetDiscountState"
    ]),
    renderForm() {
      this.changeDiscountView(true);
    },
    renderSearch() {
      if (this.showDiscountForm) {
        Swal.fire({
          title: "Esta seguro, quiere salir de la creacion de descuento?",
          text: "Los datos seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetDiscountState();
          }
        });
      }
    },
    save() {
      this.$bus.emit("discountSubmit");
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
