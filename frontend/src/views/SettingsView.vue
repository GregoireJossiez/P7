<template>
  <div id="settings">
    <h1>User settings</h1>
  </div>
</template>

<script>

export default {

  mounted() {

    const user = JSON.parse(localStorage.getItem("user"))

    const $settings = document.getElementById("settings")

    const createUserSettings = (user) => {

      const $userSettings = document.createElement("div")
      $userSettings.classList.add("userSettings")

      const $userName = document.createElement("div")
      $userName.classList.add("userName")

      const $userNameLabel = document.createElement("label")
      $userNameLabel.setAttribute("for", "userName")
      $userNameLabel.textContent = "Name : "

      const $userNameInput = document.createElement("input")
      $userNameInput.setAttribute("id", "userName")
      $userNameInput.setAttribute("value", user.name)

      const $userFamilyName = document.createElement("div")
      $userFamilyName.classList.add("userFamilyName")

      const $userFamilyNameLabel = document.createElement("label")
      $userFamilyNameLabel.setAttribute("for", "userFamilyName")
      $userFamilyNameLabel.textContent = "Family name : "

      const $userFamilyNameInput = document.createElement("input")
      $userFamilyNameInput.setAttribute("id", "userFamilyName")
      $userFamilyNameInput.setAttribute("value", user.familyName)

      const $userEmail = document.createElement("div")
      $userEmail.classList.add("userEmail")

      const $userEmailLabel = document.createElement("label")
      $userEmailLabel.setAttribute("for", "userEmail")
      $userEmailLabel.textContent = "Email : "

      const $userEmailInput = document.createElement("input")
      $userEmailInput.setAttribute("id", "userEmail")
      $userEmailInput.setAttribute("type", "email")
      $userEmailInput.setAttribute("value", user.email)

      const $userPassword = document.createElement("div")
      $userPassword.classList.add("userPassword")

      const $userPreviousPassword = document.createElement("span")

      const $userPreviousPasswordLabel = document.createElement("label")
      $userPreviousPasswordLabel.setAttribute("for", "userPreviousPassword")
      $userPreviousPasswordLabel.textContent = "Previous password : "

      const $userPreviousPasswordInput = document.createElement("input")
      $userPreviousPasswordInput.setAttribute("id", "userPreviousPassword")
      $userPreviousPasswordInput.setAttribute("type", "password")
      $userPreviousPasswordInput.setAttribute("value", "")

      const $userNewPassword = document.createElement("span")

      const $userPasswordLabel = document.createElement("label")
      $userPasswordLabel.setAttribute("for", "userPassword")
      $userPasswordLabel.textContent = "New password : "

      const $userPasswordInput = document.createElement("input")
      $userPasswordInput.setAttribute("id", "userPassword")
      $userPasswordInput.setAttribute("type", "password")
      $userPasswordInput.setAttribute("value", "")

      const $userNewPassword2 = document.createElement("span")

      const $userPasswordLabel2 = document.createElement("label")
      $userPasswordLabel2.setAttribute("for", "userPassword2")
      $userPasswordLabel2.textContent = "New password : "

      const $userPasswordInput2 = document.createElement("input")
      $userPasswordInput2.setAttribute("id", "userPassword2")
      $userPasswordInput2.setAttribute("type", "password")
      $userPasswordInput2.setAttribute("value", "")

      const $updateBtn = document.createElement("div")
      $updateBtn.classList.add("updateBtn")

      const $updateUserBtn = document.createElement("button")
      $updateUserBtn.classList.add("updateAccountBtn")
      $updateUserBtn.textContent = "Update account"
      $updateUserBtn.addEventListener("click", updateUser)

      const $deleteBtn = document.createElement("div")
      $deleteBtn.classList.add("deleteBtn")

      const $deleteUserBtn = document.createElement("button")
      $deleteUserBtn.classList.add("deleteAccountBtn")
      $deleteUserBtn.textContent = "Delete account"
      $deleteUserBtn.addEventListener("click", deleteUser)

      $userName.appendChild($userNameLabel)
      $userName.appendChild($userNameInput)
      $userSettings.appendChild($userName)

      $userFamilyName.appendChild($userFamilyNameLabel)
      $userFamilyName.appendChild($userFamilyNameInput)
      $userSettings.appendChild($userFamilyName)

      $userEmail.appendChild($userEmailLabel)
      $userEmail.appendChild($userEmailInput)
      $userSettings.appendChild($userEmail)

      $userPreviousPassword.appendChild($userPreviousPasswordLabel)
      $userPreviousPassword.appendChild($userPreviousPasswordInput)
      $userNewPassword.appendChild($userPasswordLabel)
      $userNewPassword.appendChild($userPasswordInput)
      $userNewPassword2.appendChild($userPasswordLabel2)
      $userNewPassword2.appendChild($userPasswordInput2)

      $userPassword.appendChild($userPreviousPassword)
      $userPassword.appendChild($userNewPassword)
      $userPassword.appendChild($userNewPassword2)
      $userSettings.appendChild($userPassword)

      $updateBtn.appendChild($updateUserBtn)
      $deleteBtn.appendChild($deleteUserBtn)
      $userSettings.appendChild($updateBtn)
      $userSettings.appendChild($deleteBtn)

      return $userSettings
    }

    const updateUser = async () => {
      console.log("update");
    }

    const deleteUser = async () => {
      console.log("delete");

      this.$store.dispatch('deleteUser', user).then(() => {
        localStorage.clear()
        window.location.reload()
      })
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
        $settings.appendChild(createUserSettings(user))
      }).catch((err) => {
        console.log(err);
      })

    }

    main()
  },
}


</script>

<style lang="scss">

.userPassword {
  display: flex;
  flex-direction: column;
}

.updateAccountBtn {
  color: blue;
  border-radius: 5px;
  width: 150px;
  height: 25px;
  &:hover {
    cursor: pointer;
  }
}

.deleteAccountBtn {
  color: red;
  border-radius: 5px;
  width: 150px;
  height: 25px;
  &:hover {
    background-color: red;
    color: white;
    cursor: pointer;
  }
}
</style>
