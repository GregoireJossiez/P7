<template>
  <div class="container">
    <div class="home">
      <img id="logo" alt="Groupomnia logo" src="../assets/icon-left-font-monochrome-black-cropped.png">
    </div>
    <section id="forms">
      <div class="form--wrapper">
        <span class="switch">
          <button id="login" @click="switchForm" class="switch--btn switch--btn__left switch--btn__left--active" type="button" name="button">LogIn</button>
          <button id="signin" @click="switchForm" class="switch--btn switch--btn__right" type="button" name="button">SignIn</button>
        </span>
        <div id="loginForm" class="form">
          <label for="EmailLogin">Email</label>
          <input ref="emailLogin" @focusout="formVerif" class="formInput" type="text" name="Email" id="EmailLogin" placeholder="your@email.com" required>
          <p id="EmailLoginErrorMsg" class="warning disabled">{{ this.formErrorMsg }}</p>
          <label for="PasswordLogin">Password</label>
          <input ref="passwordLogin" @focusout="formVerif" class="formInput" type="password" name="Password" id="PasswordLogin" required>
          <span>
            <p id="res" class="warning">{{ $store.state.passwordMessage }}</p>
          </span>
          <button id="submit" @click="logIn" value="Log in">Log In</button>
        </div>
        <div id="signinForm" class="form form--hidden">
          <label for="EmailSignin">Email</label>
          <input ref="emailSignin" @focusout="formVerif" class="formInput" type="text" name="Email" id="EmailSignin" placeholder="your@email.com" required>
          <p id="EmailSigninErrorMsg" class="warning disabled">{{ this.formErrorMsg }}</p>
          <label for="NameSignin">Name</label>
          <input ref="nameSignin" @focusout="formVerif" class="formInput" type="text" name="Name" id="NameSignin" required>
          <label for="familyNameSignin">familyName</label>
          <input ref="familyNameSignin" @focusout="formVerif" class="formInput" type="text" name="familyName" id="familyNameSignin" required>
          <label for="PasswordSignin">Password</label>
          <input ref="passwordSignin" @focusout="formVerif" class="formInput" type="password" name="Password" id="PasswordSignin" required>
          <button id="submit" @click="signIn" value="Sign in">Sign in</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data() {
    return {
      formErrorMsg: ''
    }
  },
  components: {

  },
  mounted() {
    this.$refs.emailLogin.focus()
    document.title = "Groupomania - Login or SignIn"
  },
  methods: {
    switchForm(e) {

      const switchId = e.target.attributes.id.value;

      if (switchId === "login") {
        e.target.classList.add("switch--btn__left--active")
        document.getElementById("signin").classList.remove("switch--btn__right--active")
        document.getElementById("loginForm").classList.remove("form--hidden")
        document.getElementById("signinForm").classList.add("form--hidden")
        this.$refs.emailLogin.focus()
      }

      if (switchId === "signin") {
        e.target.classList.add("switch--btn__right--active")
        document.getElementById("login").classList.remove("switch--btn__left--active")
        document.getElementById("signinForm").classList.remove("form--hidden")
        document.getElementById("loginForm").classList.add("form--hidden")
        this.$refs.emailSignin.focus()
      }
    },

    formVerif(e) {
      const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
      const input = e.target.attributes.id.value
      const errorMsg = document.getElementById(`${input}ErrorMsg`)

      if (e.target.attributes.id.value === "EmailLogin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
        } else if (this.$refs.emailLogin.value.match(emailRegEx) === null) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Must be an email'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }

      if (e.target.attributes.id.value === "PasswordLogin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Field required'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }

      if (e.target.attributes.id.value === "EmailSignin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
        } else if (this.$refs.emailSignin.value.match(emailRegEx) === null) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Must be an email'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }

      if (e.target.attributes.id.value === "NameSignin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Field required'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }

      if (e.target.attributes.id.value === "familyNameSignin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Field required'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }

      if (e.target.attributes.id.value === "PasswordSignin") {
        if (!e.target.value) {
          e.target.classList.add("formInput__warning")
          errorMsg.classList.remove("disabled")
          this.formErrorMsg = 'Field required'
        } else {
          e.target.classList.remove("formInput__warning")
          errorMsg.classList.add("disabled")
          this.formErrorMsg = ''
        }
      }
    },

    logIn() {

      const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

      if (this.$refs.emailLogin.value && this.$refs.emailLogin.value.match(emailRegEx) && this.$refs.passwordLogin.value) {
       const user = {
         email: this.$refs.emailLogin.value,
         password: this.$refs.passwordLogin.value,
         token: ""
       }

        this.$store.dispatch('logIn', user);
      }
    },

    signIn() {

      console.log("test");
      console.log("email : " + this.$refs.emailSignin.value + " name : " + this.$refs.nameSignin.value + " familyName : " + this.$refs.familyNameSignin.value + " password : " + this.$refs.passwordSignin.value);

      if (this.$refs.emailSignin.value && this.$refs.nameSignin.value && this.$refs.familyNameSignin.value && this.$refs.passwordSignin.value) {
        const user = {
          email: this.$refs.emailSignin.value,
          name: this.$refs.nameSignin.value,
          familyName: this.$refs.familyNameSignin.value,
          password: this.$refs.passwordSignin.value
        }

        console.log(user);

        this.$store.dispatch('signIn', user);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  position: relative;
  // background-image: url('../assets/icon.svg');
  // background-position: center;
  // background-repeat: no-repeat;
  height: 100vh;
}

#logo {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 80%;
}

.warning {
  color: red;
}

.formInput {
  border: 1px solid black;
  border-radius: 5px;
  &__warning {
    border-color: red;
  }
  &__success {
    border-color: #4BB543;
  }
}

#forms {
  position: absolute;
  margin: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 90%;
  // transform: translate(50%, 50%);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: auto;
  padding: 30px 0px 20px 0px;
  max-width: 500px;
  width: 100%;
  height: auto;
  border-top: 0px;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 0px 0px 5px lightgrey;
  &--hidden {
    display: none;
  }
  &--wrapper {
    padding-right: 2px;
    position: relative;
    margin: auto;
    max-width: 500px;
    width: 90%;
    padding-top: 18.5px;
  }
}

input, button {
  margin: auto;
  width: 200px;
}

.switch {
  &--btn {
    position: absolute;
    top: 0px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: lightgrey;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    width: 100%;
    &:hover {
      cursor: pointer;
    }
    &__left {
      width: 50%;
      left: 0px;
      border-top-left-radius: 15px;
      border-left: 1px solid black;
      border-right: 0px;
      &--active {
        background-color: white;
        border-right: 1px solid black;
        border-bottom: 0px;
      }
    }
    &__right {
      width: 50%;
      right: 0px;
      border-top-right-radius: 15px;
      border-left: 0px;
      border-right: 1px solid black;
      &--active {
        background-color: white;
        border-left: 1px solid black;
        border-bottom: 0px;
      }
    }
  }
}

</style>
