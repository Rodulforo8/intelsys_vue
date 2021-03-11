<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-col cols="12" style="position: absolute;text-align: right;color: #113d4c;">1/1</v-col>
      <v-card id="inner-title-card" elevation="6">
        <v-col v-if="!updatingModule" id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">view_module</v-icon>Crear modulo
        </v-col>
        <v-col v-else id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">view_module</v-icon>Actualizar modulo
        </v-col>
      </v-card>
      <v-form v-model="valid" ref="formValidation" lazy-validation>
        <v-row style="width:100%;margin:auto;">
          <v-col md="6" cols="12">
            <v-text-field
              prepend-inner-icon="person"
              v-model="module.nombre"
              label="Nombre del modulo"
              required
              :color="fieldColor"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              prepend-inner-icon="people"
              v-model="module.descripcion"
              required
              :color="fieldColor"
              label="Descripcion del modulo"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-select
              :items="this.allModules"
              prepend-inner-icon="view_module"
              v-model="module.dependencia"
              label="Depende de:"
              item-text="nombre"
              item-value="id"
              clearable
              :color="fieldColor"
              outlined
            ></v-select>
          </v-col>
          <v-col md="6" cols="12">
            <v-select
              :items="['Activo', 'Inactivo']"
              prepend-inner-icon="view_module"
              v-model="module.status"
              @change="changeStatus()"
              label="Estatus:"
              clearable
              :color="fieldColor"
              outlined
              required
              :rules="[rules.required]"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
      <v-col>
        <v-divider></v-divider>
      </v-col>
      <v-container>
        <h3>Elegir icono del modulo</h3>
        <v-row>
          <v-col align="center" md="5" cols="12">
            <v-icon color="#1c6255" size="150">{{module.icon}}</v-icon>
          </v-col>
          <v-col style="padding:0" cols="1">
            <v-divider vertical="false"></v-divider>
          </v-col>
          <v-col align="left" md="5" cols="12">
            <v-btn
              @click="module.icon = icon"
              v-model="test"
              v-for="icon in icons"
              :key="icon"
              color="iconColor"
              icon
            >
              <v-icon medium>{{icon}}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import mixin from "../../../mixins";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  data() {
    return {
      test: "",
      valid: true,
      module: null,
      value: 3000,
      icons: [
        "person",
        "group",
        "mdi-account-group",
        "note_add",
        "mdi-folder-text-outline",
        "attach_money",
        "mdi-cash-multiple",
        "mdi-account-badge-horizontal-outline",
        "build",
        "assignment",
        "work",
        "mdi-folder-account-outline",
        "view_module",
        "android",
        "mdi-account-cash-outline"
      ]
    };
  },
  created() {
    this.module = this.oneModule;
    if (!this.updatingModule) {
      this.module.icon = "person";
    }
    this.$bus.on(`submitModule`, () => {
      this.submitForm();
    });
  
  },
  beforeDestroy() {

    this.$bus.off("submitModule");
  },
  computed: {
    ...mapGetters(["allModules", "oneModule", "updatingModule"])
  },
  methods: {
    ...mapActions(["createModule", "updateModule"]),
    submitForm() {
      if (this.$refs.formValidation.validate()) {
        if (this.updatingModule) {
          Swal.fire({
            title: `Esta seguro que quiere actualizar el modulo ${
              this.module.nombre
            }?`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Crear",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              this.updateModule();
            }
          });
        } else {
          Swal.fire({
            title: `Esta seguro que quiere crear el modulo ${
              this.module.nombre
            }?`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Crear",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              this.createModule();
            }
          });
        }
      }
    },
    changeStatus() {
      if (this.module.status === "Activo") {
        this.module.estatus = 0;
      } else {
        this.module.estatus = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#select-icon-title {
  text-align: center;
}
</style>
