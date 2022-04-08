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
      // const email = document.getElementById("Email")
      // const password = document.getElementById("Password")
      // const submitBtn = document.getElementById("submit");


      // console.log("test");
      // console.log("email : " + this.$refs.email.value + " password : " + this.$refs.password.value);

      const user = {
        email: this.$refs.email.value,
        password: this.$refs.password.value,
        token: ""
      }

      // const token = {
      //   token: ""
      // }

      // console.log(user);
      // console.log(user.username);

      this.$store.dispatch('logIn', user);

      // const postLogIn = async () => fetch('http://localhost:3000/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(user),
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8'
      //   },
      // }).then((response) => {
      //   return response.json({ response });
      // }).then((data) => {
      //   let token = {
      //     token: data.token
      //   }
      //   console.log(token);
      // }).catch((err) => {
      //   console.log("Problème avec fetch : " + err.message);
      // })

      // fetch('http://localhost:3000/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(user),
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8'
      //   },
      // }).then((response) => {
      //   return response.json({ response });
      // }).then((data) => {
      //   let token = {
      //     token: data.token
      //   }
      //   console.log(token);
      // }).catch((err) => {
      //   console.log("Problème avec fetch : " + err.message);
      // })

      // this.$store.dispatch('getUserInfo', user, postLogIn(), token);
      // this.$store.dispatch('getUserInfo', user, token);
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
