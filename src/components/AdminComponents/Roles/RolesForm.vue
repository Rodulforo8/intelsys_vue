<template>
  <v-container>
    <v-col md="12" cols="12">
      <v-card id="outer-card" elevation="6">
              <v-col cols="12" style="position: absolute;text-align: right;color: #113d4c;">1/1</v-col>
        <v-col cols="12" id="top-step-counter">1/1</v-col>
        <v-card id="inner-title-card" elevation="6">
          <v-col v-if="!updatingRole" id="inner-title-card-col">
            <v-icon id="inner-card-icon" large color="white">person_add</v-icon>Crear Rol
          </v-col>
          <v-col v-else id="inner-title-card-col">
            <v-icon id="inner-card-icon" large color="white">edit</v-icon>Actualizar Rol
          </v-col>
        </v-card>
        <v-col md="12" cols="12">
          <v-row>
            <v-container>
              <h2>Nombre y permiso del rol</h2>
              <v-col id="form-col" cols="12" md="4">
                <v-form v-model="valid" ref="roleForm" lazy-validation>
                  <v-text-field
                    label="Introduzca el nombre del rol"
                    v-model="role.nombre"
                    prepend-inner-icon="perm_identity"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-form>
              </v-col>
              <v-col>
                <Permissions/>
              </v-col>
            </v-container>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-container>
</template>
<script>
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
import Permissions from "@/components/AdminComponents/Roles/PermissionsTable";
const Swal = require("sweetalert2");
export default {
  props: ["editing", "selected"],
  mixins: [mixin],
  components: {
    Permissions
  },
  data() {
    return {
      valid: true,
      role: {
        id: null,
        nombre: null,
        permisos: []
      }
    };
  },
  created() {
    this.role = this.oneRole;
  },
  mounted() {
    this.$bus.on("saveRole", () => {
      this.submitForm()
    });
  },
  watch: {
    name: function() {
      this.name = this.upperCaseString(this.name);
    }
  },
  computed: {
    ...mapGetters(["allRoles", "roleName", "roleStepperValue", "oneRole", "updatingRole"])
  },
  methods: {
    ...mapActions(["addRoleName", "roleStep",  "createRole", "updateRole"]),
  
    submitForm() {
  if (this.$refs.roleForm.validate()) {
  if (this.updatingRole) {
        Swal.fire({
          title:
            "Esta seguro que quiere actualizar el siguiente rol?: " +
            this.roleName,
          text: "",
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Actualizar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
          
            this.updateRole();
          }
        });
      } else {
        Swal.fire({
          title:
            "Esta seguro que quiere crear el siguiente rol?: " + this.oneRole.nombre,
          text: "",
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Crear",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.createRole();
          }
        });
      }
}





      
    }, 
  }
};
</script>
<style lang="scss" scoped>
#btn {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #4caf50;
  color: white;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

#form-col {
  margin: auto;
}

#top-step-counter {
  position: absolute;
  text-align: right;
  color: #113d4c;
}
</style>
