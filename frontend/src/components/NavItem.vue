<template>
  <nav>
    <router-link id="home" v-if="!home" to="/">&#8249;</router-link>
    <h1 v-if="home">Home</h1>
    <h1 v-if="!home">Settings</h1>
    <ul id="toggleMenu" data-open="false" @click="showMenu">
      <li id="heaven" class="toggleMenu--btn">☰</li>
      <li id="times" class="toggleMenu--btn disabled">&times;</li>
      <li><router-link id="settingsPageLink" to="/settings" class="disabled">Settings</router-link></li>
      <li><p id="logout" @click="logOut" class="disabled">Logout</p></li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'NavItem',

  data() {
    return {
      home: false
    }
  },

  mounted() {
    if (location.hash == "#/") {
      this.home = true
    }
  },

  methods: {
    logOut() {
      localStorage.clear()
      window.location.href = '/#/login';
    },

    showMenu() {
      console.log("TEST");
      let toggleMenu = document.getElementById("toggleMenu")
      let settings = document.getElementById("settingsPageLink")
      let logout = document.getElementById("logout")
      let heavenBtn = document.getElementById("heaven")
      let timesBtn = document.getElementById("times")

      if (toggleMenu.getAttribute("data-open") === "false") {
        console.log("Opening");
        settings.classList.remove("disabled")
        logout.classList.remove("disabled")
        heavenBtn.classList.add("disabled")
        timesBtn.classList.remove("disabled")
        toggleMenu.setAttribute("data-open", "true")
      } else {
        console.log("Closing");
        settings.classList.add("disabled")
        logout.classList.add("disabled")
        timesBtn.classList.add("disabled")
        heavenBtn.classList.remove("disabled")
        toggleMenu.setAttribute("data-open", "false")
      }
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
  position: relative;
  margin: auto;
  padding: 30px;
  max-width: 1700px;
  margin-bottom: 25px;
  h1 {
    margin: auto;
  }
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#toggleMenu {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 50px;
  height: 50px;
  &:hover {
    cursor: pointer;
  }
}

#home {
  position: absolute;
  width: 45px;
  height: 45px;
  top: 24px;
  left: 10px;
  font-size: 30px;
  text-decoration: none;
  &:hover {
    background-color: #E2E2E2;
    border-radius: 45px;
  }
}

.toggleMenu--btn {
  font-size: 30px;
}

#logout {
  font-weight: bold;
}
</style>
