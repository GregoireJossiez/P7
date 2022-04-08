<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
  <!-- <form class="" action="" method="post">
    <div class="form">
      <label for="Email">Email</label>
      <input type="text" name="Email" id="Email" required>
      <label for="Password">Password</label>
      <input type="password" name="Password" id="Password" required>
      <input type="submit" value="Sign in">
    </div>
  </form> -->
  <div class="form">
    <label for="Email">Email</label>
    <input ref="email" type="text" name="Email" id="Email" required>
    <label for="Name">Name</label>
    <input ref="name" type="text" name="Name" id="Name" required>
    <label for="familyName">familyName</label>
    <input ref="familyName" type="text" name="familyName" id="familyName" required>
    <label for="Password">Password</label>
    <input ref="password" type="password" name="Password" id="Password" required>
    <button id="submit" @click="signIn" value="Sign in">Sign in</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {

  },
  methods: {
    signIn() {

      console.log("test");
      console.log("email : " + this.$refs.email.value + " name : " + this.$refs.name.value + " familyName : " + this.$refs.familyName.value + " password : " + this.$refs.password.value);

      const user = {
        email: this.$refs.email.value,
        name: this.$refs.name.value,
        familyName: this.$refs.familyName.value,
        password: this.$refs.password.value
      }

      console.log(user);

      this.$store.dispatch('signIn', user);
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
