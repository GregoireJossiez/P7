<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
  <!-- <form class="" action="" method="">
    <div class="form">
      <label for="Email">Email</label>
      <input ref="email" type="text" name="Email" id="Email" required>
      <label for="Password">Password</label>
      <input ref="password" type="password" name="Password" id="Password" required>
      <button id="submit" @click="login" value="Log in">Log In</button>
    </div>
  </form> -->
  <div class="form">
    <label for="Email">Email</label>
    <input ref="email" type="text" name="Email" id="Email" required>
    <label for="Password">Password</label>
    <input ref="password" type="password" name="Password" id="Password" required>
    <button id="submit" @click="logIn" value="Log in">Log In</button>
    <p>{{ $store.state.user }}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {

  },
  mounted() {
    this.$refs.email.focus()
  },
  methods: {
    logIn() {

      const user = {
        email: this.$refs.email.value,
        password: this.$refs.password.value,
        token: ""
      }

      this.$store.dispatch('logIn', user);
    }
  }
}
</script>

<style lang="css" scoped>

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;

}
input, button {
  margin: auto;
  width: 200px;
}

</style>
