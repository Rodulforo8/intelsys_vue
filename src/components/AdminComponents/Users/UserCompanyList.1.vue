<template>
  <v-container>
    <!-- {{userCompanies.company}} -->
    <!---------------------------------[ CREANDO ]--------------------------------->
    <v-data-table
      v-if="!updatingUser"
      :loading="dataTableLoader"
      :headers="headers"
      :items="items"
      no-data-text="El usuario no posee compañias"
      sort-by="calories"
      class="elevation-1"
      pagination.sync="pagination"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <h2 v-if="updatingUser">Compañías:</h2>
            <h2 v-else>Compañías:</h2>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" overlay-opacity="0" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn id="btn" v-on="on">
                <v-icon large color="white">note_add</v-icon>Agregar Compañía
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">
                  <h3>Agregar Compañía</h3>
                </span>
              </v-card-title>
              <v-card-text>
                <v-form valid ref="companyUserForm" lazy-validation>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-autocomplete
                          :items="allowedCompanies"
                          prepend-inner-icon="work"
                          v-model="companyPayload"
                          label="Compañía"
                          item-text="name"
                          item-value="id"
                          return-object
                          :color="fieldColor"
                          required
                          clearable
                          :rules="[rules.required]"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#52887e" text @click="close">Cancelar</v-btn>
                <!-- <v-btn color="#52887e" v-if="updatingUser" text @click="save">Guardar</v-btn> -->
                <v-btn color="#52887e" text @click="add">Agregar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="red" medium @click="deleteItemCreating(item)">delete</v-icon>
      </template>
      <template v-slot:item.view="{ item }">
        <v-icon v-if="updatingUser" color="blue" medium @click="roleView(item)">remove_red_eye</v-icon>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
    <!---------------------------------[ CREANDO ]-------------------------------------------->
    <!-----------------------------------[ ACTUALIZANDO ] ---------------------------------------->
    <v-data-table
      v-else
      :loading="dataTableLoader"
      :headers="headers"
      :items="userCompanies.company"
      no-data-text="El usuario no posee permisos"
      sort-by="calories"
      class="elevation-1"
      pagination.sync="pagination"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <h2>Compañías:</h2>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="showCompanyDialog" id="btn">
            <v-icon large color="white">note_add</v-icon>Agregar Compañía
          </v-btn>
          <v-dialog persistent v-model="dialog" overlay-opacity="0" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn hidden ref="permitsButton" id="btn" v-on="on">
                <v-icon large color="white">note_add</v-icon>Agregar Permiso
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">
                  <h3>Administrar Permisos</h3>
                </span>
              </v-card-title>
              <v-card-text>
                <v-form valid ref="userCompanyRoleForm" lazy-validation>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          v-if="updatingUser"
                          :items="allRoles"
                          prepend-inner-icon="person"
                          v-model="payload"
                          return-object
                          label="Rol"
                          item-text="nombre"
                          item-value="id"
                          :color="fieldColor"
                          required
                          clearable
                          :rules="[rules.required]"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-btn @click="addToRoleTable" id="btn">
                          <v-icon large color="white"></v-icon>Agregar
                        </v-btn>
                      </v-col>
                      <v-col cols="12">
                        <v-data-table
                          :headers="rolesHeaders"
                          :items="userCompanyRoles"
                          no-data-text="El usuario no posee permisos"
                          sort-by="calories"
                          class="elevation-0"
                        >
                          <template v-slot:item.action="{ item }">
                            <v-icon color="red" @click="deleteItem(item)" medium>delete</v-icon>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#52887e" text @click="close">CERRAR</v-btn>
                <!-- <v-btn color="#52887e" text @click="save">Guardar</v-btn> -->
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!------------------------------------------[ AGREGAR COMPA;IA ]----------------------------------->
          <v-dialog persistent v-model="dialog2" overlay-opacity="0" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">
                  <h3>Compañías</h3>
                </span>
              </v-card-title>
              <v-card-text>
                <v-form valid ref="companyUserAddForm" lazy-validation>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-autocomplete
                          :items="allowedCompanies"
                          prepend-inner-icon="work"
                          v-model="companyPayload"
                          label="Compañía"
                          item-text="name"
                          item-value="id"
                          return-object
                          :color="fieldColor"
                          required
                          clearable
                          :rules="[rules.required]"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#52887e" text @click="close2">CERRAR</v-btn>
                <v-btn color="#52887e" text @click="save">AGREGAR</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!------------------------------------------[ AGREGAR COMPA;IA ]----------------------------------->
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon v-if="updatingUser" color="red" medium @click="deleteItem(item)">delete</v-icon>
        <v-icon v-else color="red" medium @click="deleteItemCreating(item)">delete</v-icon>
      </template>
      <template v-slot:item.view="{ item }">
        <v-icon v-if="updatingUser" color="blue" medium @click="roleView(item)">remove_red_eye</v-icon>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
    <!-----------------------------------[ ACTUALIZANDO ] ---------------------------------------->
  </v-container>
</template>

<script>
import mixin from "../../../mixins";
import { mapGetters, mapActions } from "vuex";
import { thistle } from "color-name";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  data() {
    return {
      companyUserId: "",
      companyUserName: "",
      updatingCompanyCreationId: "",
      valid: true,
      items: [],
      headers: [],
      pagination: { rowsPerPage: 30 },
      selectedRole: "",
      payload: "",
      companyPayload: "",
      companyDataTable: false,
      search: "",
      dialog: false,
      dialog2: false,
      fieldColor: "#1c6255",
      updatingHeader: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Compañía", align: "center", value: "name" },
        { text: "Roles Asignados", align: "center", value: "roles.length" },
        {
          text: "Administrar Roles",
          align: "center",
          value: "view",
          sortable: false
        }
        // {
        //   text: "Eliminar Compañía",
        //   align: "center",
        //   value: "action",
        //   sortable: false
        // }
      ],
      creatingHeader: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Compañía", align: "left", value: "name" },
        { text: "Eliminar", value: "action", sortable: false }
      ],
      rolesHeaders: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "role_id"
        },
        {
          text: "Nombre",
          align: "center",
          sortable: false,
          value: "role_name"
        },
        {
          text: "Eliminar",
          align: "right",
          sortable: false,
          value: "action"
        }
      ],
      editedIndex: -1,
      allowedCompanies: ""
    };
  },
  computed: {
    ...mapGetters([
      "allRoles",
      "allCompanies",
      "oneUser",
      "dataTableLoader",
      "userCompanies",
      "allActiveCompanies",
      "updatingUser",
      "authPermissions",
      "authUserSelectedCompany",
      "authUserCompanies",
      "userCompanyRoles"
    ]),
    updatingVariable() {
      return this.updatingUser;
    }
  },
  watch: {
    updatingVariable() {
      this.fetchAllUserCompanies();
      this.headers = this.updatingHeader;
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "fetchAllUserCompanies",
      "createUserCompany",
      "deleteUserCompanyRole",
      "fetchRoles",
      "deleteUserCompanyItem",
      "addUserCompanyItem",
      "fetchLocalizeRoles",
      "createUserCompanyRole",
      "addUserCompanyRoles"
    ]),
    async initialize() {
      this.fetchRoles();
      this.setAllowedCompanies();
      //******************************************************************/
      if (this.updatingUser) {
        await this.fetchAllUserCompanies();
        this.headers = this.updatingHeader;
        // this.items = await this.userCompanies.company;
      }
      //******************************************************************/
      else {
        this.headers = this.creatingHeader;
        this.items.push({
          id: this.authUserSelectedCompany.id,
          name: this.authUserSelectedCompany.name
        });
        this.addUserCompanyItem(this.authUserSelectedCompany.id);
        this.allowedCompanies = this.allowedCompanies.filter(
          company => company.id !== this.authUserSelectedCompany.id
        );
      }
    },

    editItem(item) {
      this.editedIndex = this.userCompanies.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      Swal.fire({
        title: `Esta seguro que quiere eliminar el rol?`,
        text: "Se borrara el permiso y se restringira el acceso",
        type: "question",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          console.log(item);
          var payload = {
            id: item.company_user_role_id,
            role_id: item.role_id
          };
          this.deleteUserCompanyRole(payload);
        }
      });
    },
    deleteItemCreating(item) {
      this.items = this.items.filter(arrayItem => arrayItem.id !== item.id);
      this.allowedCompanies.push(item);
      this.deleteUserCompanyItem(item.id);
    },
    close() {
      this.dialog = false;
      // this.resetUserCompanyData();
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    close2() {
      this.dialog2 = false;
    },
    save() {
      if (this.$refs.companyUserAddForm.validate()) {
        var founded = this.userCompanies.company.findIndex(
          element => element.id === this.companyPayload.id
        );

        if (founded > -1) {
          Swal.fire({
            type: "error",
            title:
              "La compañía seleccionada ya se encuentra asignado al usuario",
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          Swal.fire({
            title: `Esta seguro que quiere asignar la compañía seleccionada?`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              var payload = {
                user_id: this.oneUser.user_id,
                company: this.companyPayload
              };

              this.createUserCompany(payload);
              this.close2();
            }
          });
        }
      }
    },
    add() {
      if (
        this.companyPayload.id === "" ||
        this.items.indexOf(this.companyPayload) > -1
      ) {
      } else {
        if (this.$refs.companyUserForm.validate()) {
          this.items.push(this.companyPayload);
          this.allowedCompanies = this.allowedCompanies.filter(
            company => company.id !== this.companyPayload.id
          );
          this.addUserCompanyItem(this.companyPayload.id);
          this.companyPayload = {
            id: "",
            name: ""
          };

          this.close();
        }
      }
    },
    resetCompany() {
      this.companyDataTable = true;
      this.payload.company_id = "";
    },
    resetUserCompanyData() {
      this.payload = {
        role_id: "",
        status: 0
      };
      this.search = "";
    },
    setAllowedCompanies() {
      var array = [];
      for (var i in this.authPermissions.company) {
        var json = {
          id: this.authPermissions.company[i].id,
          name: this.authPermissions.company[i].name
        };
        array.push(json);
      }

      this.allowedCompanies = array;
    },
    roleView(item) {
      this.companyUserId = item.company_user_id;
      this.addUserCompanyRoles(item.roles);
      this.fetchLocalizeRoles(item.id);
      this.$refs.permitsButton.$el.click();
    },
    addToRoleTable() {
      var bool = Number.isInteger(this.payload.id);

      if (bool === false) {
        Swal.fire({
          type: "error",
          title: "Debe seleccionar un rol",
          showConfirmButton: false,
          timer: 3000
        });
      } else if (this.$refs.userCompanyRoleForm.validate()) {
        var founded = this.userCompanyRoles.findIndex(
          element => element.role_id === this.payload.id
        );

        if (founded > -1) {
          Swal.fire({
            type: "error",
            title: "El rol seleccionado ya se encuentra asignado al usuario",
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          Swal.fire({
            title: `Esta seguro que quiere asignar el permiso seleccionado?`,
            text: "",
            type: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            showCancelButton: true
          }).then(result => {
            if (result.value) {
              this.payload.company_user_id = this.companyUserId;
              this.createUserCompanyRole(this.payload);
            }
          });
        }
      }
    },
    showCompanyDialog() {
      this.dialog2 = true;
    }
  }
};
</script>
<style lang="scss" scoped>
#btn {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #1c6255;
  color: white;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>
