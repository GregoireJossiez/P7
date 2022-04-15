<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/contact">Contact</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/signin">Sign-in</router-link> |
    <router-link to="/newpost">Create a post</router-link> |
    <router-link to="/posts">Posts</router-link> |
    <router-link to="/settings">Settings</router-link>
    <p id="logout" @click="logOut">Logout</p>
  </nav>
  <router-view/>
</template>

<script>

export default {
  methods: {
    logOut() {
      localStorage.clear()
      window.location.reload()
    }
  }
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#logout {
  text-align: center;
  width: 100px;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 25px;
  font-weight: bold;
  &:hover {
    background-color: lightblue;
  }
}
</style>
