<template>
  <div></div>
</template>
<script>
const Swal = require("sweetalert2");
export default {
  data() {
    return {};
  },
  created() {
    this.showNotification();
  },
  methods: {
    showNotification() {
      Swal.fire({
        icon: "error",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 2000
      });
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
