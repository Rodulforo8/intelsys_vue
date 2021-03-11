<template>
  <v-container>
    <v-card id="outer-card" elevation="6">
      <v-col cols="12" style="position: absolute;text-align: right;color: #113d4c;">1/1</v-col>
      <v-card id="inner-title-card" elevation="6">
        <v-col v-if="!updatingUser" id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">mdi-account-search</v-icon>Crear Usuario
        </v-col>
        <v-col v-else id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">mdi-account-search</v-icon>Editar Usuario
        </v-col>
      </v-card>
      <v-container>
        <h2>Datos de usuario:</h2>
      </v-container>
      <v-form v-model="valid" ref="formValidation">
        <v-row style="width:100%;margin:auto;">
          <v-col md="6" cols="12">
            <v-text-field
              v-model="user.first_name"
              prepend-inner-icon="person"
              label="Nombres"
              required
              :color="fieldColor"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              v-model="user.last_name"
              prepend-inner-icon="people"
              required
              :color="fieldColor"
              label="Apellidos"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <v-text-field
              v-model="user.username"
              prepend-inner-icon="person"
              required
              :color="fieldColor"
              label="Nombre de usuario"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <v-text-field
              v-model="user.email"
              prepend-inner-icon="email"
              required
              :color="fieldColor"
              label="Correo"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-col>
          <v-col v-if="!updatingUser" md="4" cols="12">
            <v-text-field
              v-model="user.password"
              prepend-inner-icon="lock"
              required
                  maxlength="10"
              :color="fieldColor"
              label="Contraseña"
              :rules="[rules.required, rules.passwordLength, rules.passwordUpperCase, rules.passwordNumber, rules.passwordSpecialChar]"
            ></v-text-field>
          </v-col>
          <!-- <v-col v-if="!updatingUser" md="3" cols="12">
            <v-text-field
              v-model="user.password"
              prepend-inner-icon="lock"
              required
              :color="fieldColor"
              label="Repetir contraseña"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>-->
          <!-- <v-col md="6" cols="12"> -->
          <!-- <v-select
              :items="groups"
              v-model="user.groups"
              prepend-icon="help"
              label="Grupo"
              item-text="name"
              item-value="id"
              :color="fieldColor"
              outlined
              required
              :rules="[rules.required]"
          ></v-select>-->
          <!-- </v-col> -->
        </v-row>
      </v-form>
      <UserCompanyList :fieldColor="fieldColor"/>
    </v-card>
  </v-container>
</template>
<script>
import mixin from "../../../mixins";
import { mapGetters, mapActions } from "vuex";
import UserCompanyList from "@/components/AdminComponents/Users/UserCompanyList.1";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  components: {
    UserCompanyList
  },
  data() {
    return {
      valid: true,
      user: "",
      groups: [
        {
          id: 1,
          name: "Administrador"
        },
        {
          id: 2,
          name: "Anonimo"
        }
      ]
    };
  },
  created() {
    this.user = this.oneUser;
    this.$bus.on("submitForm", () => {
      this.submit();
    });
  },
  beforeDestroy() {
    this.$bus.off("submitForm");
  },
  computed: {
    ...mapGetters(["oneUser", "updatingUser"])
  },
  methods: {
    ...mapActions(["createUser", "updateUser"]),
    submit() {
      if (this.$refs.formValidation.validate()) {
        if (this.updatingUser) {
          Swal.fire({
            title: `Esta seguro que quiere actualizar el usuario: ${
              this.user.username
            }"`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Actualizar",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              this.updateUser();
            }
          });
        } else {
          Swal.fire({
            title: `Esta seguro que quiere crear el usuario: ${
              this.user.username
            }"`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Crear",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              if (this.oneUser.companies.length === 0) {
                Swal.fire({
                  type: "error",
                  title:
                    "El usuario debe tener por lo menos una compañía asignada",
                  showConfirmButton: false,
                  timer: 3000
                });
              } else {
                this.createUser();
              }
            }
          });
        }
      }
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
</style>
