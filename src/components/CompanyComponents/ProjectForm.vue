<template>
  <v-data-table
    :headers="headers"
    :items="oneCompany.proyectos"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          <h2>Proyectos:</h2>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" overlay-opacity="0" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn v-if="permissionVariables.create" id="btn" @click="creating = true" v-on="on">
              <v-icon large color="white">note_add</v-icon>Agregar Proyecto
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <h3>
                <span class="headline">{{ formTitle }}</span>
              </h3>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="valid" ref="projectForm" lnazy-validation>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nameproy"
                        prepend-icon="business_center"
                        label="Nombre del proyecto"
                        required
                        :color="fieldColor"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="items"
                        v-model="editedItem.proestatus"
                        item-text="name"
                        item-value="value"
                        prepend-icon="help"
                        label="Status"
                        outlined
                        required
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.pdireccion"
                        prepend-icon="room"
                        label="Direccion"
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.px"
                        prepend-icon="room"
                        label="Px"
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.py"
                        prepend-icon="room"
                        label="Py"
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col class="form-col" md="6" cols="12">
                      <!-- <v-select
                        :items="allCountries"
                        v-model="editedItem.pais_id"
                        item-text="nombre"
                        item-value="id"
                        prepend-icon="flag"
                        :color="fieldColor"
                        @change="getProvinces()"
                        label="País"
                        outlined
                        required
                        :rules="[rules.required]"
                      ></v-select>-->
                      <v-autocomplete
                        :color="fieldColor"
                        v-model="editedItem.pais_id"
                        prepend-icon="flag"
                        :items="allCountries"
                        item-text="nombre"
                        item-value="id"
                        @change="getProvinces()"
                        :rules="[rules.required]"
                        dense
                        filled
                        label="País"
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="form-col" md="6" cols="12">
                      <v-select
                        eager
                        :items="projectProvinces"
                        v-model="editedItem.provincia_id"
                        item-text="nombre"
                        item-value="id"
                        :color="fieldColor"
                        prepend-icon="flag"
                        label="Provincia"
                        outlined
                        :loading="projectProvinceLoader"
                        name="Provincia"
                        required
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#1c6255" text @click="close">Cancelar</v-btn>
              <v-btn color="#1c6255" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template  v-slot:item.action="{ item }">
      <v-icon v-if="permissionVariables.update" color="blue" medium class="mr-2" @click="editItem(item)">edit</v-icon>
      <v-icon v-if="permissionVariables.delete"  color="red" medium @click="deleteItem(item)">delete</v-icon>
    </template>
    <template v-slot:no-data></template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
const Swal = require("sweetalert2");
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  data: () => ({
    creating: false,
    creationText: "Esta seguro, quiere crear el proyecto? ",
    updatingText: "Esta seguro, quiere actualizar el proyecto? ",
    dialog: false,
    valid: true,
    provinceId: "",
    fieldColor: "#1c6255",
    items: [
      {
        name: "Activo",
        value: "A"
      },
      {
        name: "Inactivo",
        value: "I"
      }
    ],
    headers: [
      {
        text: "Id",
        align: "left",
        sortable: false,
        value: "id"
      },
      { text: "Proyecto", value: "nameproy" },
      { text: "Compañía", value: "compania" },
      { text: "País", value: "pais" },
      { text: "Provincia", value: "provincia" },
      { text: "Estatus", value: "proestatus" },
      { text: "Actions", value: "action", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      compania: "",
      pais_id: "",
      pais: "",
      provincia_id: "",
      provincia: "",
      proestatus: "A",
      pdireccion: "",
      px: "",
      py: "",
      company_id: "",
      nameproy: ""
    }
  }),

  computed: {
    ...mapGetters([
      "oneCompany",
      "allCountries",
      "projectProvinces",
      "projectProvinceLoader",
      "permissionVariables"
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Crear Proyecto" : "Editar Proyecto";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {},

  methods: {
    ...mapActions([
      "fetchProjectProvinces",
      "createProject",
      "updateProject",
      "deleteProject"
    ]),

    editItem(item) {
      this.editedIndex = this.oneCompany.proyectos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.fetchProjectProvinces(this.editedItem.pais_id);
    },

    deleteItem(item) {
      const index = this.oneCompany.proyectos.indexOf(item);
      item.index = index;
      Swal.fire({
        title: "Estas seguro que quieres borrar el proyecto? ",
        text: "Se borraran los datos permanentemente",
        type: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.deleteProject(item);
        }
      });
    },

    close() {
      this.dialog = false;
      this.creating = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      var text = this.creating ? this.creationText : this.updatingText;

      if (this.$refs.projectForm.validate()) {
        Swal.fire({
          title: text,
          text: text + this.editedItem.nameproy,
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
          if (this.editedIndex > -1) {
            //actualiza
            this.editedItem.index = this.editedIndex;
            this.updateProject(this.editedItem);
          } else {
            // crea
            this.createProject(this.editedItem);
          }
          //   this.oneCompany.proyectos.push(this.editedItem);

          this.close();
        });
      }
    },
    getProvinces() {
      this.fetchProjectProvinces(this.editedItem.pais_id);
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
