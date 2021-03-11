
<template>
  <v-container id="container" fluid>
    <!-- <h2>PRUEBAS</h2>
    <br>
    <br>
    <v-btn @click="generatePdf()" id="login-btn">Generar pdf</v-btn>-->
    <!-- <v-btn @click="refresh()" id="login-btn">Refrescar</v-btn> -->
  </v-container>
</template>
<script>
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins";
import jsPDF from "jspdf";

export default {
  data() {
    return {
      value: 2000
    };
  },
  computed:{
    ...mapGetters([''])
  },
  created() {
 
  },
  methods: {
    generatePdf() {
      var doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });
      // var doc = new jsPDF();
      doc.setFontSize(9);
      // pdf.setFont("helvetica");
      // pdf.setFontType("bold");
      // pdf.setFontSize(9);
      doc.text("Hello world!", 10, 10);
      doc.text("Hello world2!", 42, 10);
      doc.save("reporte.pdf");
    },
    refresh() {
      this.$bus.emit("refresh", 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
#login-btn {
  background-color: #1c6255;
  color: white;
  width: 20%;
}
</style>
