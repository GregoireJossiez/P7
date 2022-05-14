<template>
  <Nav/>
  <div id="modifyPostPopup" class="popup modify">
    <form class="" action="" method="" enctype="multipart/form-data">
      <div class="form form-modify">
        <button id="close" @click="closeModify">&times;</button>
        <label for="post">Modify your post</label>
        <textarea ref="postModify" id="post" postid="" name="Post" rows="8" cols="80" value=""></textarea>
        <div class="img-container">
          <img id="img" src="" alt="">
          <button id="delete" class="delete" @click="removeImg">Remove</button>
        </div>
        <input ref="media" id="media" type="file" name="media" accept="image/png, image/jpeg, image/jpg, image/gif">
        <button id="submit" @click="modifyPost">Modify post</button>
      </div>
    </form>
  </div>
  <div id="deletePostPopup" postid="" class="popup">
    <div class="deletePopup">
      <button id="close" @click="closeDelete">&times;</button>
      <p class="deletePopup-txt">Are you sure you want to delete this post ?</p>
      <button id="cancel" @click="closeDelete" class="deletePopup-btn deletePopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button @click="deletePost" class="deletePopup-btn deletePopup-btn__delete" type="button" name="delete">Delete</button>
    </div>
  </div>
  <div id="Posts">
    <!-- <h1>Most recents posts</h1> -->
    <div id="newPost" class="post">
      <form class="" action="" method="" enctype="multipart/form-data">
        <div class="form">
          <button id="close" class="disabled" @click="clearNewPost">&times;</button>
          <textarea @input="textListener" class="emptyForm" ref="postNewPost" placeholder="Create a new post" id="postNewPost" name="Post" rows="8" cols="80"></textarea>
          <img :src="imgPreview" alt="">
          <label id="mediaLabel" for="mediaNewPost">Choose image</label>
          <input @change="changeImgPreview" ref="mediaNewPost" id="mediaNewPost" type="file" name="media" value="" accept="image/png, image/jpeg, image/jpg, image/gif" style="display: none;">
          <button id="submit" class="disabled" @click="post">Post</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import Nav from './../components/NavItem'

export default {
  data() {
    return {
      imgPreview: ''
    }
  },

  name: 'HomeView',
  components: {
    Nav
  },
  mounted() {
    document.title = "Groupomania - Home"

    // Retrieving user data in the localStorage

    const user = JSON.parse(localStorage.getItem("user"))

    // Redirect if user is not logged

    if (!user) {
      window.location.href = '/#/login';
      return
    }

    const token = user.token

    const $posts = document.getElementById("Posts")

    // Create the posts

    const createPost = (post) => {

      const $post = document.createElement("div")
      $post.classList.add("post")
      $post.setAttribute("postId", post.id)
      // $post.setAttribute("data-v-6837beee", "")

      const $postTop = document.createElement("div")
      $postTop.classList.add("postTop")

      const $postInfo = document.createElement("div")
      $postInfo.classList.add("postInfo")

      const $postUserAvatar = document.createElement("img")
      $postUserAvatar.classList.add("userAvatar")
      $postUserAvatar.setAttribute("src", post.userAvatar)

      const $postAuthor = document.createElement("p")
      $postAuthor.classList.add("author")
      $postAuthor.textContent = post.authorName + " " + post.authorFamilyName

      var created = Date.parse(post.createdAt);
      var now = new Date().getTime();
      var howLongAgo = created - now

      const $postDate = document.createElement("p")
      $postDate.classList.add("date")
      $postDate.textContent = getHumanTime(howLongAgo)

      const $postSettings = document.createElement("div")
      $postSettings.classList.add("postSettings")

      const $postSettingsMenu = document.createElement("p")
      $postSettingsMenu.classList.add("postSettingsMenu")
      $postSettingsMenu.addEventListener("click", postMenu)
      $postSettingsMenu.textContent = "..."

      const $settingsMenu = document.createElement("ul")
      $settingsMenu.setAttribute("id", `menu${post.id}`)
      $settingsMenu.classList.add("settingsMenu")

      const $modify = document.createElement("li")
      $modify.classList.add("settingsMenuItem")
      $modify.addEventListener("click", modifyPost)
      $modify.textContent = "Modify publication"

      const $delete = document.createElement("li")
      $delete.classList.add("settingsMenuItem")
      $delete.addEventListener("click", deletePost)
      $delete.textContent = "Delete publication"

      const $report = document.createElement("li")
      $report.classList.add("settingsMenuItem")
      $report.addEventListener("click", reportPost)
      $report.textContent = "Report publication"

      const $postContentDiv = document.createElement("div")
      $postContentDiv.classList.add("content")

      const $postContent = document.createElement("p")
      $postContent.textContent = post.content

      const $postReaction = document.createElement("div")
      $postReaction.classList.add("reaction")

      const $postLikes = document.createElement("p")
      $postLikes.classList.add("likes")
      $postLikes.addEventListener("click", addLikes)
      $postLikes.setAttribute("isLiked", post.liked)
      $postLikes.textContent = "Like"

      const $numberOfLikes = document.createElement("p")
      $numberOfLikes.classList.add("numberOfLikes")
      $numberOfLikes.setAttribute("id", `like${post.id}`)
      $numberOfLikes.textContent = post.likes

      $postInfo.appendChild($postUserAvatar)
      $postInfo.appendChild($postAuthor)
      $postInfo.appendChild($postDate)

      if (post.userId === user.id || user.admin) {
        $settingsMenu.appendChild($modify)
        $settingsMenu.appendChild($delete)
        $postSettingsMenu.appendChild($settingsMenu)
        $postSettings.appendChild($postSettingsMenu)
      }


      $postTop.appendChild($postInfo)
      $postTop.appendChild($postSettings)

      $post.appendChild($postTop)

      if (post.imageUrl != null) {
        const $postImage = document.createElement("img")
        $postImage.classList.add("image")
        $postImage.setAttribute("src", post.imageUrl)

        $postContent.appendChild($postImage)
      }
      $postContentDiv.appendChild($postContent)

      $post.appendChild($postContentDiv)

      $postReaction.appendChild($numberOfLikes)

      $postReaction.appendChild($postLikes)

      $post.appendChild($postReaction)

      return $post
    }

    // Calculate relative time

    const getHumanTime = (timestamp) => {

      // Convert to integer
      var time = Math.abs(timestamp)

      // Define humanTime and units
      var humanTime, units;

      // If there are years
      if (time > (1000 * 60 * 60 * 24 * 365)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 365), 10)
        units = 'years'
      }

      // If there are months
      else if (time > (1000 * 60 * 60 * 24 * 30)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10)
        units = 'months'
      }

      // If there are weeks
      else if (time > (1000 * 60 * 60 * 24 * 7)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 7), 10)
        units = 'weeks'
      }

      // If there are days
      else if (time > (1000 * 60 * 60 * 24)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10)
        units = 'days'
      }

      // If there are hours
      else if (time > (1000 * 60 * 60)) {
        humanTime = parseInt(time / (1000 * 60 * 60), 10)
        units = 'hours'
      }

      // If there are minutes
      else if (time > (1000 * 60)) {
        humanTime = parseInt(time / (1000 * 60), 10)
        units = 'minutes'
      }

      // If there are seconds
      else if (time > (1000)) {
        humanTime = parseInt(time / (1000), 10)
        units = 'seconds'
      }

      return humanTime + ' ' + units + ' ' + 'ago'
    }

    // Add likes function

    const addLikes = async (e) => {
      let target = e.target.closest(".post")
      let postid = +target.attributes.postid.value
      let likeCount = document.getElementById(`like${postid}`)

      let likeState = e.target.attributes.isLiked.value
      let $like = e.target
      console.log(likeState);

      if (likeState === "true") {
        likeCount.textContent--
        console.log("UNLIKE");
        $like.setAttribute("isLiked", "false")

        const like = {
          userId: user.id,
          userNames: user.name + " " + user.familyName,
          postId: postid,
          like: 0,
          token: token
        }

          this.$store.dispatch('addLike', like);
      } else {
        likeCount.textContent++
        console.log("LIKE");
        $like.setAttribute("isLiked", "true")

        const like = {
          userId: user.id,
          userNames: user.name + " " + user.familyName,
          postId: postid,
          like: 1,
          token: token
        }

          this.$store.dispatch('addLike', like);
      }
    }

    const postMenu = async (e) => {
      let postid = e.target.closest(".post").attributes.postid.value
      let menu = document.getElementById(`menu${postid}`)
      let menuActive = menu.classList.contains("active")

      if (menuActive === false) {
        menu.classList.add("active")
      } else {
        menu.classList.remove("active")
      }
    }

    const modifyPost = async (e) => {
      let postid = e.target.closest(".post").attributes.postid.value
      let content = document.querySelector(`div[postid='${postid}'] div.content p`)
      let img = document.querySelector(`div[postid='${postid}'] div.content p img`)

      let popup = document.getElementById("modifyPostPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.getElementById("post").textContent = content.textContent
        document.getElementById("post").attributes.postid.value = postid
        if (img) {
          // let filename = img.attributes.src.value.split("/images/")[1]
          document.getElementById("img").attributes.src.value = img.attributes.src.value
          document.getElementById("img").setAttribute("removed", "false")
          document.getElementById("delete").classList.add("delete-active")
        }
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
    }

    const deletePost = async (e) => {

      let postid = e.target.closest(".post").attributes.postid.value
      let popup = document.getElementById("deletePostPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.getElementById("deletePostPopup").attributes.postid.value = postid
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
    }

    const reportPost = async (e) => {
      let postid = e.target.closest(".post").attributes.postid.value
      console.log("REPORT" + postid);
    }

    const main = async () => {

      // Retrieve all posts from DB

      const getAllPosts = async () => {
        fetch('http://localhost:3000/api/post/', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + token
          },
        }).then(function(response) {
          return response.json({ response });
        }).then((data) => {
          data.forEach((post) => {

            post.liked = false

            post.users.forEach((postData) => {

              if (postData.id === user.id) {
                post.liked = postData.like.hasLiked
              }
            })

            if (!post.users.length) {
              post.liked = false
            }

            $posts.appendChild(createPost(post))
          })
        }).catch((err) => {
          console.log("Problème avec fetch : " + err.message);
        })
      }

      getAllPosts()
    }

    main()
  },
  methods: {
    post() {

      // Retrieving user data in the localStorage

      const user = JSON.parse(localStorage.getItem("user"))

      const formData = new FormData()
      formData.append("user", user)
      formData.append("userId", user.id)
      formData.append("name", user.name)
      formData.append("familyName", user.familyName)
      formData.append("token", user.token)
      formData.append("content", this.$refs.postNewPost.value)
      formData.append("image", this.$refs.mediaNewPost.files[0])

      // Calling the function in the $store

      event.preventDefault()
      console.log(this.$refs.mediaNewPost.files[0]);
      this.$store.dispatch('newPost', formData);
      // window.location.reload()
    },

    textListener(e) {

      const closeBtn = document.querySelector("#newPost form div.form #close")
      const textArea = document.querySelector("#newPost form div.form #postNewPost")
      const postBtn = document.querySelector("#newPost form div.form #submit")

      if (e.target.value) {
        closeBtn.classList.remove("disabled")
        postBtn.classList.remove("disabled")
        textArea.classList.remove("emptyForm")
      } else {
        closeBtn.classList.add("disabled")
        postBtn.classList.add("disabled")
        textArea.classList.add("emptyForm")
      }
    },

    changeImgPreview() {

      console.log(this.$refs.mediaNewPost.files[0].name);
      // document.getElementById("avatarPreview").attributes.src.value = URL.createObjectURL(this.$refs.media.files[0])

      if (this.imgPreview) {
        this.imgPreview = ""
        this.imgPreview = URL.createObjectURL(this.$refs.mediaNewPost.files[0])
      } else {
        this.imgPreview = URL.createObjectURL(this.$refs.mediaNewPost.files[0])
      }

      const closeBtn = document.querySelector("#newPost form div.form #close")
      const textArea = document.querySelector("#newPost form div.form #postNewPost")
      const postBtn = document.querySelector("#newPost form div.form #submit")

      if (this.$refs.mediaNewPost.files[0].name) {
        closeBtn.classList.remove("disabled")
        postBtn.classList.remove("disabled")
        textArea.classList.remove("emptyForm")
      } else {
        closeBtn.classList.add("disabled")
        postBtn.classList.add("disabled")
        textArea.classList.add("emptyForm")
      }
    },

    modifyPost(e) {
      event.preventDefault()
      let postid = document.getElementById("post").attributes.postid.value
      let popup = e.target.closest("div.popup")
      let imgRemoved = document.getElementById("img").attributes.removed

      const user = JSON.parse(localStorage.getItem("user"))

      const formData = new FormData()
      formData.append("id", postid)
      formData.append("user", user)
      formData.append("userId", user.id)
      formData.append("name", user.name)
      formData.append("familyName", user.familyName)
      formData.append("token", user.token)
      formData.append("content", this.$refs.postModify.value)
      if (imgRemoved) {
        let img = document.querySelector(`div[postid='${postid}'] div.content p img`)
        let imageUrl = img.attributes.src.value
        formData.append("imgRemoved", imgRemoved.value)
        formData.append("imageUrl", imageUrl)
      }
      formData.append("image", this.$refs.media.files[0])

      this.$store.dispatch('modifyPost', formData);

      popup.classList.remove("popup-active")
      document.getElementById("delete").classList.remove("delete-active")
      document.getElementById("post").textContent = ""
      document.getElementById("post").attributes.postid.value = ""
      document.getElementById("img").attributes.src.value = ""
      document.getElementById("img").removeAttribute("removed")
      document.querySelector("body").removeAttribute("style")

      // Modify post content to avoid refreshing the page

      let post = document.querySelector(`div.post[postid='${postid}']`)
      let postContent = post.querySelector(".content p")

      if (this.$refs.postModify.value) {
        postContent.textContent = this.$refs.postModify.value
      }

      if (!postContent.querySelector("img")) {
        console.log("NO IMAGE");
        if (!this.$refs.media.files[0]) {
          console.log("NO IMAGE ADDED");
        } else {
          console.log(this.$refs.media.files[0].name);
          const $postImage = document.createElement("img")
          $postImage.classList.add("image")
          $postImage.setAttribute("src", URL.createObjectURL(this.$refs.media.files[0]))

          postContent.appendChild($postImage)
        }
      } else {
        console.log("IMAGE");
        if (imgRemoved) {
          if (this.$refs.media.files[0]) {
            postContent.querySelector("img").attributes.src.value = URL.createObjectURL(this.$refs.media.files[0])
          } else {
            postContent.querySelector("img").remove()
          }
        }
        if (this.$refs.media.files[0]) {
          postContent.querySelector("img").attributes.src.value = URL.createObjectURL(this.$refs.media.files[0])
        }
      }

      console.log("POST MODIFIED");
      console.log(postContent.textContent);
    },

    deletePost(e) {
      event.preventDefault()
      console.log(e);
      const user = JSON.parse(localStorage.getItem("user"))

      let postid = e.target.closest("#deletePostPopup").attributes.postid.value
      let post = document.querySelector(`div.post[postid='${postid}']`)
      console.log(post);
      user.postid = postid
      let popup = document.getElementById("deletePostPopup")

      this.$store.dispatch('deletePost', user).then((res) => {
        console.log("THEN RES");
        console.log(res);
        post.remove()
      }).catch((error) => {
        console.log("CATCH ERROR");
        console.log(error);
      })

      document.querySelector("body").removeAttribute("style")
      popup.classList.remove("popup-active")
    },

    closeModify(e) {
      event.preventDefault()

      let popup = e.target.closest("div.popup")

      popup.classList.remove("popup-active")
      document.getElementById("delete").classList.remove("delete-active")
      document.getElementById("post").textContent = ""
      document.getElementById("post").attributes.postid.value = ""
      document.getElementById("img").attributes.src.value = ""
      document.getElementById("img").removeAttribute("removed")
      document.querySelector("body").removeAttribute("style")
    },

    closeDelete(e) {
      event.preventDefault()

      let popup = e.target.closest("div.popup")

      popup.classList.remove("popup-active")
      document.getElementById("deletePostPopup").attributes.postid.value = ""
      document.querySelector("body").removeAttribute("style")
    },

    clearNewPost() {
      event.preventDefault()

      const textArea = document.querySelector("#newPost form div.form textarea")
      const inputFile = document.querySelector("#newPost form div.form input")
      const closeBtn = document.querySelector("#newPost form div.form #close")
      const postBtn = document.querySelector("#newPost form div.form #submit")

      textArea.value = ""
      this.imgPreview = ""
      inputFile.value = ""
      closeBtn.classList.add("disabled")
      postBtn.classList.add("disabled")
      textArea.classList.add("emptyForm")
    },

    removeImg() {
      event.preventDefault()
      console.log("remove");
      document.getElementById("delete").classList.remove("delete-active")
      document.getElementById("img").attributes.src.value = ""
      document.getElementById("img").attributes.removed.value = "true"
    }
  }
}
</script>

<style lang="scss">

#app {
  position: relative;
}

textarea, button, input {
  margin: auto;
  width: 90%;
}

textarea {
  resize: none;
  border-radius: 15px;
  padding: 5px;
  padding-bottom: 10px;
}

button {
}

#submit, #cancel, #avatarLabel, #mediaLabel {
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
  &:disabled {
    background-color: grey;
    &:hover {
     cursor: default;
   }
  }
}

p {
  margin: 0px;
  padding: 0px;
}

#Posts  {
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 1000px;
}

#newPost {
  position: relative;
  .form {
    margin: auto;
    width: 85%;
  }
  .emptyForm {
    height: 10px;
    background-color: white;
    &:focus {
      height: auto;
      &:hover {
        background-color: white;
      }
    }
    &:hover {
      background-color: #E2E2E2;
    }
  }
  #mediaLabel {
    margin: auto;
    width: 200px;
  }
}

.post {
  margin: auto;
  padding: 5px 0px 5px 0px;
  width: 90%;
  height: auto;
  border: 1px solid black;
  border-radius: 15px;
  box-shadow: 0px 0px 5px lightgrey;
}

.postTop {
  display: flex;
  justify-content: space-between;
}

.postInfo {
  position: relative;
}

.userAvatar {
  position: absolute;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 25px;
}

.author, .date {
  text-align: left;
  padding: 0px 20px 0px 60px;
}

.date {
  font-size: 12px;
}

.postSettings {
  padding: 0px 10px 0px 20px;
  &Menu {
    padding: 0px 10px 10px 10px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    position: relative;
    &:hover {
      background-color: lightgrey;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}

.settingsMenu {
  display: none;
}

.active {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: absolute;
  z-index: 2;
  width: 200px;
  background-color: white;
  border: 1px solid black;
  box-shadow: 0px 0px 5px lightgrey;
  right: 0px;
}

ul {
  padding: 0px;
  list-style: none;
  font-size: 15px;
  li {
    &:hover {
      background-color: lightgrey;
    }
  }
}

#modifyPostPopup, #deletePostPopup {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.4);
}

.popup {
  display: none;
  &-active {
    display: block;
  }
}

.deletePopup, .changePasswordPopup, .modifyUserPopup, .changeAvatarPopup {
  position: fixed;
  display: flex;
  justify-content: space-around;
  border: 1px solid black;
  border-radius: 20px;
  background-color: white;
  width: 50%;
  height: 25%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 5px lightgrey;
  @media (max-width: 1000px) {
    padding: 5px;
    width: 95%;
  }
  &-txt {
    align-self: center;
  }
  &-btn {
    width: 40%;
    border-radius: 7px;
    position: absolute;
    bottom: 20px;
    &__cancel {
      left: 20px;
    }
    &__delete {
      right: 20px;
      background-color: #f85149;
      color: white;
      font-size: 15px;
      font-weight: bold;
      height: 25px;
      border: 0px;
      border-radius: 7px;
      &:hover {
        cursor: pointer;
        background-color: #ff6b63;
      }
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  background-color: white;
  padding: 20px;
  &-modify {
    position: fixed;
    overflow: scroll;
    border: 1px solid black;
    border-radius: 15px;
    max-width: 700px;
    min-width: 0px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45%;
    height: 90%;
    box-shadow: 0px 0px 5px lightgrey;
    @media (max-width: 1000px) {
      padding: 5px;
      width: 95%;
      height: 97%;
    }
    img {
      width: 40%;
    }
  }
}

.img-container {
  position: relative;
  button {
    position: absolute;
    width: 20%;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
}

.delete {
  display: none;
  &-active {
   display: block;
 }
}

#close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 20px;
  width: 25px;
  background-color: lightgrey;
  border: 0px;
  border-radius: 25px;
  &:hover {
    cursor: pointer;
    background-color: grey;
  }
}

.disabled {
  display: none;
}

.modify {

}

.content p {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image {
  width: 100%;
}

.likes {
  padding: 0px 20px 0px 20px;
  width: 20px;
}

.likes:hover {
  font-weight: bold;
  cursor: pointer;
}

p[isLiked="false"] {

}

p[isLiked="true"] {
  color: #0080FF;
  font-weight: bold;
}

.numberOfLikes {
  padding: 0px 20px 0px 20px;
  text-align: left;
  font-weight: normal;
}
</style>
