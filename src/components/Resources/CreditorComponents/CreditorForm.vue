<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-col cols="12" style="position: absolute;text-align: right;color: #113d4c;">1/1</v-col>
      <v-card id="inner-title-card" elevation="6">
        <v-col v-if="!updatingCreditor" id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">mdi-account-plus</v-icon>Crear acreedor
        </v-col>
        <v-col v-else id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">mdi-account-edit</v-icon>Editar acreedor
        </v-col>
      </v-card>
      <v-container>
        <h2>Datos del acreedor:</h2>
      </v-container>
      <v-form v-model="valid" ref="creditorFormValidation" lazy-validation>
        <v-row >
            <v-col cols="12" md="2">
            </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              prepend-inner-icon="person"
              v-model="creditor.acnameacree"
              label="Nombre del acreedor"
              required
              :color="fieldColor"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col class="form-col" md="4" cols="12">
            <v-autocomplete
              :color="fieldColor"
              prepend-icon="work"
              v-model="creditor.status"
              :items="status"
              item-text="text"
              item-value="value"
              dense
              required
              filled
              label="Estatus del acreedor :"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-col>
</template>

<script>
import mixin from "@/mixins";
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  data() {
    return {
      valid: true,
      creditor: "",
      creationText: "Esta seguro, quiere crear el acreedor?",
      updatingText: "Esta seguro, quiere actualizar el acreedor?",
      status: [
        {
          text: "Activo",
          value: "A"
        },
        {
          text: "Inactivo",
          value: "I"
        }
      ]
    };
  },
  created() {
    this.$bus.on("submitCreditorFrom", () => {
      this.submitForm();
    });
    this.creditor = this.oneCreditor;
  },
  computed: {
    ...mapGetters(["updatingCreditor", "oneCreditor"])
  },
  methods: {
    ...mapActions(["createCreditor", "updateCreditor"]),

    submitForm() {
      var text = this.updatingCreditor ? this.updatingText : this.creationText;
      if (this.$refs.creditorFormValidation.validate()) {
        Swal.fire({
          title: text,
          text: text + this.oneCreditor.acnameacree,
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.updatingCreditor
              ? this.updateCreditor()
              : this.createCreditor();
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
