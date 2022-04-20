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
  <form class="" action="" method="" enctype="multipart/form-data">
    <div class="form">
      <label for="post">Your post</label>
      <textarea ref="post" id="post" name="Post" rows="8" cols="80"></textarea>
      <label for="media">Add a media</label>
      <input ref="media" id="media" type="file" name="media" value="">
      <button id="submit" @click="post">Post</button>
      <p>{{  $store.state.user }}</p>
    </div>
  </form>
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

      // const post = {
      //   userId: user.id,
      //   name: user.name,
      //   familyName: user.familyName,
      //   token: user.token,
      //   content: this.$refs.post.value,
      //   file: this.$refs.media.files[0]
      // }

      const formData = new FormData()
      formData.append("user", user)
      formData.append("userId", user.id)
      formData.append("name", user.name)
      formData.append("familyName", user.familyName)
      formData.append("token", user.token)
      formData.append("content", this.$refs.post.value)
      formData.append("image", this.$refs.media.files[0])

      // Calling the function in the $store

      event.preventDefault()
      console.log(this.$refs.media.files[0]);
      this.$store.dispatch('newPost', formData);
      // window.location.reload()
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
textarea, button, input {
  margin: auto;
  width: 500px;
}

</style>
