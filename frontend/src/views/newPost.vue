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
    <label for="post">Your post</label>
    <textarea ref="post" id="post" name="Post" rows="8" cols="80"></textarea>
    <button id="submit" @click="post">Post</button>
    <p>{{  $store.state.user }}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {

  },
  methods: {
    post() {

      // Retrieving user data in the localStorage

      const user = JSON.parse(localStorage.getItem("user"))

      // Assembling the request body to fetch

      const post = {
        userId: user.id,
        name: user.name,
        familyName: user.familyName,
        token: user.token,
        content: this.$refs.post.value
      }

      // Calling the function in the $store

      this.$store.dispatch('newPost', post);
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
textarea, button {
  margin: auto;
  width: 500px;
}

</style>
