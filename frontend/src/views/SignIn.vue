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
      console.log("email : " + this.$refs.email.value + " password : " + this.$refs.password.value);

      const user = {
        username: this.$refs.email.value,
        password: this.$refs.password.value
      }

      console.log(user);

      fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
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
