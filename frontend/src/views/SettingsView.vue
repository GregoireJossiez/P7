<template>
  <div id="changeAvatarPopup" class="popup">
    <div class="changeAvatarPopup">
      <button id="close" @click="closePopup">&times;</button>
      <span class="avatarPreview">
        <label for="media">Upload avatar</label>
        <vue-cropper v-if="imgSrc != ''"
          ref="cropper"
          :view-mode="3"
          :auto-crop-area="1"
          :aspect-ratio="4 / 4"
          :src="imgSrc"
          :style="{ width: '200px', height: '200px', margin: 'auto' }"
          :img-style="{ width: '', height: '200px' }"
          preview=".preview"
        />
        <label id="avatarLabel" for="media">Choose a file</label>
        <input @change="avatarPreview" ref="media" id="media" type="file" name="media" value="" style="display: none;">
      </span>
      <button id="cancel" @click="closePopup" class="changePasswordPopup-btn changePasswordPopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button id="submit" @click="changeAvatar" class="changePasswordPopup-btn changePasswordPopup-btn__delete" type="button" name="submit">Modify</button>
    </div>
  </div>
  <div id="modifyUserPopup" class="popup">
    <div class="modifyUserPopup">
      <button id="close" @click="closePopup">&times;</button>
      <span>
        <label for="name-popup">Name : </label>
        <input id="name-popup" ref="name" type="text" name="" value="" required>

        <label for="familyName-popup">Family name : </label>
        <input id="familyName-popup" ref="familyName" type="text" name="" value="" required>

        <label for="email-popup">Email : </label>
        <input id="email-popup" ref="email" type="email" name="" value="" required>
      </span>
      <button id="cancel" @click="closePopup" class="changePasswordPopup-btn changePasswordPopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button id="submit" @click="modifyUser" class="changePasswordPopup-btn changePasswordPopup-btn__delete" type="button" name="submit">Modify</button>
    </div>
  </div>
  <div id="changePasswordPopup" class="popup">
    <div class="changePasswordPopup">
      <button id="close" @click="closePopup">&times;</button>
      <div class="changePasswordForm">
        <span>
          <label for="Current">Current : </label>
          <input id="current" @focusout="formVerif" class="passInput" ref="current" type="password" name="" value="" required>
        </span>
        <span>
          <label for="new">New : </label>
          <input id="new" @focusout="formVerif" class="passInput" ref="new" type="password" name="" value="" required>
        </span>
        <span>
          <label for="confirm">Confirm : </label>
          <input id="confirm" @focusout="formVerif" class="passInput" ref="confirm" type="password" name="" value="" required>
        </span>
        <span>
          <p id="res" class="warning">{{ $store.state.passwordMessage }}</p>
        </span>
      </div>
      <button id="cancel" @click="closePopup" class="changePasswordPopup-btn changePasswordPopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button id="delete" @click="changePassword" class="changePasswordPopup-btn changePasswordPopup-btn__delete" type="button" name="delete">Change</button>
    </div>
  </div>
  <div id="deletePostPopup" class="popup">
    <div class="deletePopup">
      <button id="close" @click="closePopup">&times;</button>
      <p class="deletePopup-txt">Are you sure you want to delete your account ?</p>
      <button id="cancel" @click="closePopup" class="deletePopup-btn deletePopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button id="delete" @click="deleteUser" class="deletePopup-btn deletePopup-btn__delete" type="button" name="delete">Delete</button>
    </div>
  </div>
  <div id="settings">
    <h1>User settings</h1>
    <div id="userinfo" class="userinfo">
      <div class="avatar">
        <img id="userAvatar" @mouseover="showChangeAvatarBtn" @mouseleave="showChangeAvatarBtn" src="" alt="">
        <button id="changeAvatar" @mouseover="showChangeAvatarBtn" @mouseleave="showChangeAvatarBtn" @click="changeAvatarPopup" class="btn" type="button" name="button">Change</button>
      </div>
      <span>
        <label for="name">Name : </label>
        <input id="name" type="text" name="" value="" disabled>
      </span>
      <span>
        <label for="familyName">Family name : </label>
        <input id="familyName" type="text" name="" value="" disabled>
      </span>
      <span>
        <label for="email">Email : </label>
        <input id="email" type="email" name="" value="" disabled>
      </span>
      <button id="modify" @click="modifyUserPopup" type="button" name="button">Modify</button>
      <button id="changePassword" @click="changePasswordPopup" type="button" name="button">Change your password</button>
      <button id="delete" @click="deleteUserPopup" type="button" name="button">Delete your account</button>
    </div>
  </div>
</template>

<script>

import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      imgSrc: '',
      cropImg: '',
      data: null,
    }
  },

  mounted() {

    document.title = "Settings"

    const user = JSON.parse(localStorage.getItem("user"))

    // const $settings = document.getElementById("settings")

    const writeUserSettings = (user) => {

      const $userInfo = document.getElementById("userinfo")

      const $userAvatar = document.getElementById("userAvatar")
      $userAvatar.attributes.src.value = user.avatar

      const $userName = document.getElementById("name")
      $userName.value = user.name

      const $userFamilyName = document.getElementById("familyName")
      $userFamilyName.value = user.familyName

      const $userEmail = document.getElementById("email")
      $userEmail.value = user.email

      return $userInfo
    }

    const main = async () => {

      fetch(`http://localhost:3000/api/post/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + user.token
        },
      }).then((res) => {
        return res.json({ res })
      }).then((user) => {
        writeUserSettings(user)
      }).catch((err) => {
        console.log(err);
      })

    }

    main()
  },
  methods: {

    modifyUserPopup() {
      const user = JSON.parse(localStorage.getItem("user"))
      let popup = document.getElementById("modifyUserPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.querySelector("body").style.overflow = "hidden"
        document.getElementById("name-popup").value = user.name
        document.getElementById("familyName-popup").value = user.familyName
        document.getElementById("email-popup").value = user.email
      } else {
        popup.classList.remove("popup-active")
      }
    },

    modifyUser() {
      event.preventDefault()

      console.log("modify");

      const user = JSON.parse(localStorage.getItem("user"))

      const formData = new FormData()
      formData.append("function", "names")
      formData.append("userId", user.id)
      formData.append("token", user.token)
      formData.append("name", this.$refs.name.value)
      formData.append("familyName", this.$refs.familyName.value)
      formData.append("email", this.$refs.email.value)

      this.$store.dispatch('modifyUser', formData).then(() => {
        user.name = this.$refs.name.value
        user.familyName = this.$refs.familyName.value
        user.email = this.$refs.email.value
        localStorage.setItem("user", JSON.stringify(user))
      })
    },

    showChangeAvatarBtn() {
      let changeAvatarBtn = document.getElementById("changeAvatar")
      let active = changeAvatarBtn.classList.contains("btn-active")

      if (active === true) {
        changeAvatarBtn.classList.remove("btn-active")
      } else {
        changeAvatarBtn.classList.add("btn-active")
      }
    },

    changeAvatarPopup() {
      let popup = document.getElementById("changeAvatarPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
    },

    avatarPreview() {

      console.log(this.$refs.media.files[0].name);
      // document.getElementById("avatarPreview").attributes.src.value = URL.createObjectURL(this.$refs.media.files[0])

      if (this.imgSrc) {
        this.imgSrc = ""
        this.imgSrc = URL.createObjectURL(this.$refs.media.files[0])
      } else {
        this.imgSrc = URL.createObjectURL(this.$refs.media.files[0])
      }
    },

    changeAvatar() {
      event.preventDefault()

      console.log("change");

      function dataURLtoFile(dataurl, filename) {

       var arr = dataurl.split(','),
       mime = arr[0].match(/:(.*?);/)[1],
       bstr = atob(arr[1]),
       n = bstr.length,
       u8arr = new Uint8Array(n);

       while(n--){
           u8arr[n] = bstr.charCodeAt(n);
       }

       return new File([u8arr], filename, {type:mime});
      }

      if (!this.$refs.media.files[0]) {
        console.log("No file selected");
      } else {
        let base64 = this.$refs.cropper.getCroppedCanvas().toDataURL()
        let filename = this.$refs.media.files[0].name

        //Usage example:
        var file = dataURLtoFile(base64, filename);
        console.log(file);

        const user = JSON.parse(localStorage.getItem("user"))

        const formData = new FormData()
        formData.append("userId", user.id)
        formData.append("token", user.token)
        // formData.append("image", this.$refs.media.files[0])
        formData.append("image", file)

        this.$store.dispatch('changeAvatar', formData)
      }
    },

    deleteUserPopup() {
      let popup = document.getElementById("deletePostPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
    },

    changePasswordPopup() {
      let popup = document.getElementById("changePasswordPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.querySelector("body").style.overflow = "hidden"
        document.getElementById("new").classList.remove("passInput__warning")
        document.getElementById("new").classList.remove("passInput__success")
        document.getElementById("confirm").classList.remove("passInput__warning")
        document.getElementById("confirm").classList.remove("passInput__success")
      } else {
        popup.classList.remove("popup-active")
      }
    },

    formVerif(e) {
      if (e.target.attributes.id.value === "current") {
        if (!e.target.value) {
          e.target.classList.add("passInput__warning")
        } else {
          e.target.classList.remove("passInput__warning")
        }
      }
      if (e.target.attributes.id.value === "new") {
        if (!e.target.value) {
          e.target.classList.remove("passInput__success")
          e.target.classList.add("passInput__warning")
        } else {
          e.target.classList.add("passInput__success")
          e.target.classList.remove("passInput__warning")
        }
      }
      if (e.target.attributes.id.value === "confirm") {
        if (!e.target.value ||  this.$refs.new.value != this.$refs.confirm.value) {
          e.target.classList.remove("passInput__success")
          e.target.classList.add("passInput__warning")
        } else {
          e.target.classList.add("passInput__success")
          e.target.classList.remove("passInput__warning")
        }
      }
    },

    changePassword() {
      event.preventDefault()

      console.log("password");

      const user = JSON.parse(localStorage.getItem("user"))

      let formIsCorrect = false

      if (this.$refs.current.value && this.$refs.new.value && this.$refs.confirm.value && this.$refs.new.value === this.$refs.confirm.value) {
        formIsCorrect = true
      }

      if (formIsCorrect === true) {
        const formData = new FormData()
        formData.append("function", "password")
        formData.append("userId", user.id)
        formData.append("token", user.token)
        formData.append("currentPassword", this.$refs.current.value)
        formData.append("newPassword", this.$refs.new.value)

        this.$store.dispatch('modifyUserPassword', formData)
        console.log("FORM IS CORRECT AND PASSWORD IS CHANGED");
      }
    },

    closePopup(e) {
      event.preventDefault()

      let popup = e.target.closest("div.popup")

      // define which popup is active to reset some content for user and password when canceled

      if (popup.attributes.id.value === "modifyUserPopup") {
        document.getElementById("name-popup").value = ""
        document.getElementById("familyName-popup").value = ""
        document.getElementById("email-popup").value = ""
      }

      if (popup.attributes.id.value === "changePasswordPopup") {
        document.getElementById("current").value = ""
        document.getElementById("new").value = ""
        document.getElementById("confirm").value = ""
        document.getElementById("res").textContent = ""
      }

      if (popup.attributes.id.value === "changeAvatarPopup") {
        // document.getElementById("avatarPreview").attributes.src.value = ""
        document.getElementById("media").value = ""
        this.imgSrc = ""
      }

      popup.classList.remove("popup-active")
      document.querySelector("body").removeAttribute("style")
    },

    deleteUser() {
      const user = JSON.parse(localStorage.getItem("user"))

      this.$store.dispatch('deleteUser', user).then(() => {
        localStorage.clear()
        window.location.reload()
      })
    }
  },

  components: {
    VueCropper
  }
}


</script>

<style lang="scss" scoped>

.userinfo {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
  gap: 20px;
}

.avatar {
  position: relative;
}

#userAvatar {
  width: 200px;
  height: 200px;
  border: 3px solid black;
  border-radius: 50%;
  margin: auto;
}

#avatarPreview {
  height: 200px;
  margin: auto;
}

#changeAvatar {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 145px;
  height: 40px;
  border: 4px solid white;
}

span {
  display: flex;
  flex-direction: column;
}

.warning {
  color: red;
}

label {
}

input {
  max-width: 89%;
  border-radius: 5px;
  text-align: center;
}

.passInput {
  border: 2px solid black;
  &__warning {
    border-color: red;
  }
  &__success {
    border-color: #4BB543;
  }
}

button {
  background-color: #1877F2;
  color: white;
  font-size: 15px;
  font-weight: bold;
  height: 25px;
  border: 0px;
  border-radius: 7px;
  &:hover {
    cursor: pointer;
    background-color: #3588f2;
  }
}

.btn {
  display: none;
  &-active {
    display: block;
  }
}

#delete {
  background-color: #f85149;
  &:hover {
    background-color: #ff6b63;
  }
}

#changePasswordPopup, #modifyUserPopup, #changeAvatarPopup {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.4);
  span {
    display: block;
  }
}

#changeAvatarPopup {
  .avatarPreview {
    display: flex;
    gap: 20px;
  }
}

#modifyUserPopup {
  span {
    display: flex;
    width: 80%;
  }
}

.changePasswordPopup, .modifyUserPopup, .changeAvatarPopup {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 20px;
  background-color: white;
  width: 50%;
  height: 35%;
  padding-bottom: 20px;
  @media (max-width: 1000px) {
    padding: 5px;
    padding-bottom: 20px;
    width: 95%;
  }
}

.changeAvatarPopup {
  height: 50%;
}

#avatarLabel {
  width: 200px;
  background-color: #545454;
  &:hover {
    background-color: #808080;
  }
}
</style>
