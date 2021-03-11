<template>
    
</template>

<script>
const Swal = require("sweetalert2");
export default {
    created(){
  
    },
    mounted(){
        Swal.fire({
        type: 'error',
        title: 'Debes autenticarte!',
        showConfirmButton: false,
        timer: 1500
      })
      this.$router.push('/')
    }
}
</script>

<style>

</style>
