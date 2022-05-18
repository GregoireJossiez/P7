<template>
  <Nav/>
  <div id="modifyPostPopup" class="popup modify">
    <form enctype="multipart/form-data">
      <div class="form form-modify">
        <button class="close" @click="closeModify">&times;</button>
        <label for="post">Modifier la publication</label>
        <textarea ref="postModify" id="post" data-postid="" name="Post" rows="8" cols="80" value=""></textarea>
        <div class="img-container">
          <img id="img" src="" alt="">
          <button id="delete" class="delete" @click="removeImg">Remove</button>
        </div>
        <input ref="media" id="media" type="file" name="media" accept="image/png, image/jpeg, image/jpg, image/gif">
        <button class="submit" @click="modifyPost">Modify post</button>
      </div>
    </form>
  </div>
  <div id="deletePostPopup" data-postid="" class="popup">
    <div class="deletePopup">
      <button class="close" @click="closeDelete">&times;</button>
      <p class="deletePopup-txt">Are you sure you want to delete this post ?</p>
      <button @click="closeDelete" class="cancel deletePopup-btn deletePopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button @click="deletePost" class="deletePopup-btn deletePopup-btn__delete" type="button" name="delete">Delete</button>
    </div>
  </div>
  <div id="deleteCommentPopup" data-commentid="" class="popup">
    <div class="deletePopup">
      <button class="close" @click="closeDelete">&times;</button>
      <p class="deletePopup-txt">Are you sure you want to delete this comment ?</p>
      <button @click="closeDelete" class="cancel deletePopup-btn deletePopup-btn__cancel" type="button" name="cancel">Cancel</button>
      <button @click="deleteComment" class="deletePopup-btn deletePopup-btn__delete" type="button" name="delete">Delete</button>
    </div>
  </div>
  <div id="Posts">
    <!-- <h1>Most recents posts</h1> -->
    <div id="newPost" class="post">
      <form enctype="multipart/form-data">
        <div class="form">
          <button class="close disabled" @click="clearNewPost">&times;</button>
          <textarea @input="textListener" class="emptyForm" ref="postNewPost" placeholder="Create a new post" id="postNewPost" name="Post" rows="8" cols="80"></textarea>
          <img :src="imgPreview" alt="">
          <label id="mediaLabel" for="mediaNewPost">Choose image</label>
          <input @change="changeImgPreview" ref="mediaNewPost" id="mediaNewPost" type="file" name="media" value="" accept="image/png, image/jpeg, image/jpg, image/gif" style="display: none;">
          <button class="submit disabled" @click="post">Post</button>
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
      $post.setAttribute("data-postId", post.id)

      const $postTop = document.createElement("div")
      $postTop.classList.add("postTop")

      const $postInfo = document.createElement("div")
      $postInfo.classList.add("postInfo")

      const $postUserAvatar = document.createElement("img")
      $postUserAvatar.classList.add("userAvatar")
      $postUserAvatar.setAttribute("src", post.userAvatar)
      $postUserAvatar.setAttribute("alt", "User avatar")

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

      const $postSettingsMenu = document.createElement("div")
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

      // const $report = document.createElement("li")
      // $report.classList.add("settingsMenuItem")
      // $report.addEventListener("click", reportPost)
      // $report.textContent = "Report publication"

      const $postContentDiv = document.createElement("div")
      $postContentDiv.classList.add("content")

      const $postContent = document.createElement("p")
      $postContent.textContent = post.content

      const $postReaction = document.createElement("div")
      $postReaction.classList.add("reaction")

      const $postLikes = document.createElement("p")
      $postLikes.classList.add("likes")
      $postLikes.addEventListener("click", addLikes)
      $postLikes.setAttribute("data-isLiked", post.liked)
      $postLikes.textContent = "Like"

      const $numberOfLikes = document.createElement("p")
      $numberOfLikes.classList.add("numberOfLikes")
      $numberOfLikes.setAttribute("id", `like${post.id}`)
      $numberOfLikes.textContent = post.likes

      const $commentSection = document.createElement("div")
      $commentSection.classList.add("commentSection")

      const $seperator = document.createElement("hr")
      $seperator.classList.add("separator")

      const $commentSectionTitle = document.createElement("p")
      $commentSectionTitle.classList.add("commentSection--title")
      $commentSectionTitle.addEventListener("click", showCommentsSection)
      if (post.comments.length === 1) {
        $commentSectionTitle.textContent = `${post.comments.length} Comment`
      }
      if (post.comments.length > 1 || post.comments.length < 1) {
        $commentSectionTitle.textContent = `${post.comments.length} Comments`
      }

      const $seperator2 = document.createElement("hr")
      $seperator2.classList.add("separator")

      const $commentsWrapper = document.createElement("div")
      $commentsWrapper.classList.add("commentsWrapper")
      $commentsWrapper.classList.add("disabled")

      // Verify if there is comments
      if (post.comments.length > 0) {
        let comments = post.comments
        // Reverse comments order
        comments.sort((a,b)=>b-a)
        // Create HTML element for each comment of the post
        comments.forEach((comment) => {
          const $comment = document.createElement("div")
          $comment.classList.add("comment")
          // Prevent front to try access non created elements
          if (comment.userId === user.id || user.admin) {
            $comment.addEventListener("mouseenter", showCommentSettingsMenu)
            $comment.addEventListener("mouseleave", showCommentSettingsMenu)
          }
          $comment.setAttribute("data-commentId", comment.id)

          const $commentAuthorAvatar = document.createElement("img")
          $commentAuthorAvatar.classList.add("comment--avatar")
          if (comment.userAvatar != undefined) {
            $commentAuthorAvatar.setAttribute("src", comment.userAvatar)
          } else {
            $commentAuthorAvatar.setAttribute("src", "http://localhost:3000/images/default-avatar-1.jpeg")
          }
          $commentAuthorAvatar.setAttribute("alt", "User avatar")

          const $commentContentWrapper = document.createElement("div")
          $commentContentWrapper.classList.add("comment--contentWrapper")

          const $commentSettings = document.createElement("div")
          $commentSettings.classList.add("commentSettings")

          const $commentSettingsMenuDiv = document.createElement("div")
          $commentSettingsMenuDiv.classList.add("commentSettingsMenu")
          $commentSettingsMenuDiv.classList.add("disabled")
          $commentSettingsMenuDiv.addEventListener("click", commentMenu)
          $commentSettingsMenuDiv.textContent = "..."

          const $commentSettingsMenu = document.createElement("ul")
          $commentSettingsMenu.setAttribute("id", `menuComment${comment.id}`)
          $commentSettingsMenu.classList.add("settingsMenu")

          const $commentModify = document.createElement("li")
          $commentModify.classList.add("settingsMenuItem")
          $commentModify.addEventListener("click", modifyComment)
          $commentModify.textContent = "Modify comment"

          const $commentDelete = document.createElement("li")
          $commentDelete.classList.add("settingsMenuItem")
          $commentDelete.addEventListener("click", deleteComment)
          $commentDelete.textContent = "Delete comment"

          const $commentAuthor = document.createElement("p")
          $commentAuthor.classList.add("comment--author")
          $commentAuthor.textContent = comment.userNames
          const $commentContent = document.createElement("p")
          $commentContent.classList.add("comment--content")
          $commentContent.textContent = comment.content

          var created = Date.parse(comment.createdAt);
          var now = new Date().getTime();
          var howLongAgo = created - now

          const $commentDate = document.createElement("p")
          $commentDate.classList.add("date")
          $commentDate.textContent = getHumanTime(howLongAgo)

          const $modifyCommentDiv = document.createElement("div")
          $modifyCommentDiv.classList.add("modifyComment")
          $modifyCommentDiv.setAttribute("data-commentid", comment.id)
          $modifyCommentDiv.classList.add("disabled")

          const $modifyCommentTextarea = document.createElement("textarea")
          $modifyCommentTextarea.classList.add("modifyComment--textarea")
          $modifyCommentTextarea.setAttribute("data-commentid", comment.id)
          // $modifyCommentTextarea.setAttribute("value", comment.content)
          $modifyCommentTextarea.textContent = comment.content

          const $modifyCommentCloseBtn = document.createElement("button")
          $modifyCommentCloseBtn.classList.add("close")
          $modifyCommentCloseBtn.addEventListener("click", closeComment)
          $modifyCommentCloseBtn.textContent = "×"

          const $modifyCommentSubmitBtn = document.createElement("button")
          // $newCommentSubmitBtn.classList.add("submit")
          $modifyCommentSubmitBtn.addEventListener("click", postModifiedComment)
          $modifyCommentSubmitBtn.classList.add("modifyComment--submit")
          $modifyCommentSubmitBtn.textContent = ">"

          $comment.appendChild($commentAuthorAvatar)
          $commentContentWrapper.appendChild($commentAuthor)
          $commentContentWrapper.appendChild($commentContent)
          $commentContentWrapper.appendChild($commentDate)
          $comment.appendChild($commentContentWrapper)

          if (comment.userId === user.id || user.admin) {
            $commentSettingsMenu.appendChild($commentModify)
            $commentSettingsMenu.appendChild($commentDelete)
            $commentSettingsMenuDiv.appendChild($commentSettingsMenu)
            $commentSettings.appendChild($commentSettingsMenuDiv)

            $modifyCommentDiv.appendChild($modifyCommentTextarea)
            $modifyCommentDiv.appendChild($modifyCommentSubmitBtn)
            $modifyCommentDiv.appendChild($modifyCommentCloseBtn)

            $comment.appendChild($commentSettings)
            $comment.appendChild($modifyCommentDiv)
          }

          $commentsWrapper.appendChild($comment)
        });
      }

      const $newCommentDiv = document.createElement("div")
      $newCommentDiv.classList.add("newComment")

      const $newCommentUserAvatar = document.createElement("img")
      $newCommentUserAvatar.classList.add("newComment--userAvatar")
      // $newCommentUserAvatar.classList.add("userAvatar")
      $newCommentUserAvatar.setAttribute("src", user.avatar)
      $newCommentUserAvatar.setAttribute("alt", "User avatar")

      const $newCommentTextarea = document.createElement("textarea")
      $newCommentTextarea.classList.add("newComment--textarea")
      $newCommentTextarea.setAttribute("data-postid", post.id)
      $newCommentTextarea.setAttribute("placeholder", "Create a new comment")

      const $newCommentSubmitBtn = document.createElement("button")
      // $newCommentSubmitBtn.classList.add("submit")
      $newCommentSubmitBtn.addEventListener("click", newComment)
      $newCommentSubmitBtn.classList.add("newComment--submit")
      $newCommentSubmitBtn.textContent = ">"

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
        $postImage.setAttribute("alt", "Post image")

        $postContent.appendChild($postImage)
      }
      $postContentDiv.appendChild($postContent)

      $post.appendChild($postContentDiv)

      $postReaction.appendChild($numberOfLikes)

      $postReaction.appendChild($postLikes)

      $commentSection.appendChild($seperator)
      $commentSection.appendChild($commentSectionTitle)
      $commentSection.appendChild($seperator2)

      $newCommentDiv.appendChild($newCommentUserAvatar)
      $newCommentDiv.appendChild($newCommentTextarea)
      $newCommentDiv.appendChild($newCommentSubmitBtn)

      $commentSection.appendChild($commentsWrapper)
      $commentSection.appendChild($newCommentDiv)
      $postReaction.appendChild($commentSection)

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
        units = 'h'
      }

      // If there are minutes
      else if (time > (1000 * 60)) {
        humanTime = parseInt(time / (1000 * 60), 10)
        units = 'min'
      }

      // If there are seconds
      else if (time > (1000)) {
        humanTime = parseInt(time / (1000), 10)
        units = 'sec'
      }

      return humanTime + ' ' + units
    }

    // Add likes function

    const addLikes = async (e) => {
      let target = e.target.closest(".post")
      let postid = +target.getAttribute("data-postid")
      let likeCount = document.getElementById(`like${postid}`)

      let likeState = e.target.getAttribute("data-isLiked")
      let $like = e.target
      console.log(likeState);

      if (likeState === "true") {
        likeCount.textContent--
        console.log("UNLIKE");
        $like.setAttribute("data-isLiked", "false")

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
        $like.setAttribute("data-isLiked", "true")

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
      let postid = e.target.closest(".post").getAttribute("data-postid")
      let menu = document.getElementById(`menu${postid}`)
      let menuActive = menu.classList.contains("active")

      if (menuActive === false) {
        menu.classList.add("active")
      } else {
        menu.classList.remove("active")
      }
    }

    const modifyPost = async (e) => {
      let postid = e.target.closest(".post").getAttribute("data-postid")
      let content = document.querySelector(`div[data-postid='${postid}'] div.content p`)
      let img = document.querySelector(`div[data-postid='${postid}'] div.content p img`)

      let popup = document.getElementById("modifyPostPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.getElementById("post").textContent = content.textContent
        document.getElementById("post").setAttribute("data-postid", postid)
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

      let postid = e.target.closest(".post").getAttribute("data-postid")
      let popup = document.getElementById("deletePostPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.getElementById("deletePostPopup").setAttribute("data-postid", postid)
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
    }

    // newComment function

    const newComment = async (e) => {
      let post = e.target.closest("div[data-postid]")
      let postId = post.getAttribute("data-postid")
      let textarea = post.querySelector("div.reaction div.commentSection div.newComment textarea.newComment--textarea")
      let content = textarea.value

      if (textarea.value) {
        let comment = {
          postId: postId,
          userId: user.id,
          userNames: user.name + " " + user.familyName,
          content: content,
          token: user.token
        }

        this.$store.dispatch('newComment', comment);
        textarea.value = ""
        textarea.textContent = ""
      }
    }

    const showCommentsSection = async (e) => {
      let post = e.target.closest("div[data-postid]")
      let commentsWrapper = post.querySelector("div.commentsWrapper")
      let disabled = commentsWrapper.classList.contains("disabled")

      if (disabled === true) {
        commentsWrapper.classList.remove("disabled")
      } else {
        commentsWrapper.classList.add("disabled")
      }
    }

    const showCommentSettingsMenu = async (e) => {
      let comment = e.target.closest(".comment")
      let commentid = comment.getAttribute("data-commentid")
      let commentSettingsMenu = comment.querySelector(".commentSettingsMenu")
      let modifyCommentDiv = document.querySelector(`div.modifyComment[data-commentid='${commentid}']`)
      let menuDisabled = commentSettingsMenu.classList.contains("disabled")
      let modifyDisabled = modifyCommentDiv.classList.contains("disabled")

      if (modifyDisabled === true) {
        if (menuDisabled === true) {
          commentSettingsMenu.classList.remove("disabled")
        } else {
          commentSettingsMenu.classList.add("disabled")
        }
      }
    }

    const commentMenu = async (e) => {
      let commentid = e.target.closest(".comment").getAttribute("data-commentid")
      let menu = document.getElementById(`menuComment${commentid}`)
      let menuActive = menu.classList.contains("active")

      if (menuActive === false) {
        menu.classList.add("active")
      } else {
        menu.classList.remove("active")
      }
    }

    const modifyComment = async (e) => {
      let comment = e.target.closest(".comment")
      let commentid = comment.getAttribute("data-commentid")
      let commentWrapper = comment.querySelector(".comment--contentWrapper")
      let commentSettingsMenu = comment.querySelector(".commentSettings")
      let modifyCommentDiv = document.querySelector(`div.modifyComment[data-commentid='${commentid}']`)
      let disabled = modifyCommentDiv.classList.contains("disabled")

      if (disabled === true) {
        commentWrapper.classList.add("disabled")
        commentSettingsMenu.classList.add("disabled")
        modifyCommentDiv.classList.remove("disabled")
      } else {
        commentWrapper.classList.remove("disabled")
        commentSettingsMenu.classList.remove("disabled")
        modifyCommentDiv.classList.add("disabled")
      }
    }

    const postModifiedComment = async (e) => {
      let comment = e.target.closest("div[data-commentid]")
      let commentId = comment.getAttribute("data-commentid")
      let originalComment = document.querySelector(`div.comment[data-commentid='${commentId}'] div.comment--contentWrapper p.comment--content`)
      let textarea = comment.querySelector("textarea")
      let content = textarea.value

      if (textarea.value) {
        let comment = {
          id: commentId,
          userId: user.id,
          content: content,
          token: user.token
        }

        this.$store.dispatch('modifyComment', comment);
        textarea.value = ""
        textarea.textContent = ""

        originalComment.textContent = content
        modifyComment(e)
      }
    }

    const closeComment = async (e) => {
      event.preventDefault()

      let comment = e.target.closest(".comment")
      let commentid = comment.getAttribute("data-commentid")
      let commentWrapper = comment.querySelector(".comment--contentWrapper")
      let commentSettingsMenu = comment.querySelector(".commentSettings")
      let modifyCommentDiv = document.querySelector(`div.modifyComment[data-commentid='${commentid}']`)
      let disabled = modifyCommentDiv.classList.contains("disabled")

      if (disabled === true) {
        commentWrapper.classList.add("disabled")
        commentSettingsMenu.classList.add("disabled")
        modifyCommentDiv.classList.remove("disabled")
      } else {
        commentWrapper.classList.remove("disabled")
        commentSettingsMenu.classList.remove("disabled")
        modifyCommentDiv.classList.add("disabled")
      }
    }

    const deleteComment = async (e) => {

      let commentid = e.target.closest(".comment").getAttribute("data-commentid")
      let popup = document.getElementById("deleteCommentPopup")
      let popupActive = popup.classList.contains("popup-active")

      if (popupActive === false) {
        popup.classList.add("popup-active")
        document.getElementById("deleteCommentPopup").setAttribute("data-commentid", commentid)
        document.querySelector("body").style.overflow = "hidden"
      } else {
        popup.classList.remove("popup-active")
      }
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
          // Redirect if user localStorage token expired
          if (response.status == '401') {
            window.location.href = '/#/login';
            return response.json({ response });
          }
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

      const closeBtn = document.querySelector("#newPost form div.form .close")
      const textArea = document.querySelector("#newPost form div.form #postNewPost")
      const postBtn = document.querySelector("#newPost form div.form .submit")

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

      const closeBtn = document.querySelector("#newPost form div.form .close")
      const textArea = document.querySelector("#newPost form div.form #postNewPost")
      const postBtn = document.querySelector("#newPost form div.form .submit")

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
      let postid = document.getElementById("post").getAttribute("data-postid")
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
        let img = document.querySelector(`div[data-postid='${postid}'] div.content p img`)
        let imageUrl = img.attributes.src.value
        formData.append("imgRemoved", imgRemoved.value)
        formData.append("imageUrl", imageUrl)
      }
      formData.append("image", this.$refs.media.files[0])

      this.$store.dispatch('modifyPost', formData);

      popup.classList.remove("popup-active")
      document.getElementById("delete").classList.remove("delete-active")
      document.getElementById("post").textContent = ""
      document.getElementById("post").setAttribute("data-postid", "")
      document.getElementById("img").attributes.src.value = ""
      document.getElementById("img").removeAttribute("removed")
      document.querySelector("body").removeAttribute("style")

      // Modify post content to avoid refreshing the page

      let post = document.querySelector(`div.post[data-postid='${postid}']`)
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

      let postid = e.target.closest("#deletePostPopup").getAttribute("data-postid")
      let post = document.querySelector(`div.post[data-postid='${postid}']`)
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

    deleteComment(e) {
      event.preventDefault()

      const user = JSON.parse(localStorage.getItem("user"))

      let commentid = e.target.closest("#deleteCommentPopup").getAttribute("data-commentid")
      let comment = document.querySelector(`div.comment[data-commentid='${commentid}']`)
      let post = comment.closest("div[data-postid]")
      let commentSectionTitle = post.querySelector("p.commentSection--title")
      let numberOfComments = +commentSectionTitle.textContent.split(" ")[0]
      console.log(comment);
      user.commentid = commentid
      let popup = document.getElementById("deleteCommentPopup")

      this.$store.dispatch('deleteComment', user)

      comment.remove()
      document.querySelector("body").removeAttribute("style")
      popup.classList.remove("popup-active")

      console.log(post);
      console.log(commentSectionTitle);
      console.log(numberOfComments);

      if (numberOfComments === 2) {
        console.log("=== 1");
        commentSectionTitle.textContent = --numberOfComments + " " + "Comment"
      } else {
        console.log("< 1 >");
        commentSectionTitle.textContent = --numberOfComments + " " + "Comments"
      }
    },

    closeModify(e) {
      event.preventDefault()

      let popup = e.target.closest("div.popup")

      popup.classList.remove("popup-active")
      document.getElementById("delete").classList.remove("delete-active")
      document.getElementById("post").textContent = ""
      document.getElementById("post").setAttribute("data-postid", "")
      document.getElementById("img").attributes.src.value = ""
      document.getElementById("img").removeAttribute("removed")
      document.querySelector("body").removeAttribute("style")
    },

    closeDelete(e) {
      event.preventDefault()

      let popup = e.target.closest("div.popup")

      popup.classList.remove("popup-active")
      document.getElementById("deletePostPopup").setAttribute("data-postid", "")
      document.querySelector("body").removeAttribute("style")
    },

    clearNewPost() {
      event.preventDefault()

      const textArea = document.querySelector("#newPost form div.form textarea")
      const inputFile = document.querySelector("#newPost form div.form input")
      const closeBtn = document.querySelector("#newPost form div.form .close")
      const postBtn = document.querySelector("#newPost form div.form .submit")

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

.submit, .cancel, #avatarLabel, #mediaLabel {
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

.commentSection {
  &--title {
    font-weight: bold;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

.commentsWrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-bottom: 35px;
  gap: 30px;
  width: auto;
}

.comment {
  display: flex;
  &--avatar {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 25px;
  }
  &--contentWrapper {
    position: relative;
    min-width: 100px;
    padding: 5px 10px 5px 10px;
    border: 1px solid black;
    box-shadow: 0px 0px 5px lightgrey;
    border-radius: 15px;
  }
  &--author {
    text-align: left;
    font-weight: bold;
  }
  &--content {
    text-align: left;
  }
  .date {
    position: absolute;
    bottom: -20px;
    right: 0px;
  }
  .modifyComment {
    position: relative;
    padding: 0px;
    width: 100%;
    &--textarea {
      padding-right: 20px;
    }
    .close {
      position: absolute;
      top: 8px;
      right: 60px;
    }
  }
}

.newComment, .modifyComment {
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  &--userAvatar {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 25px;
  }
  &--textarea {
    width: 100%;
    height: 25px;
    border-radius: 30px;
  }
  &--submit {
    margin-left: 10px;
    background-color: white;
    border: 0px;
    border-radius: 0px;
    color: #1877F2;
    font-size: 30px;
    min-width: 42px;
    width: 42px;
    height: 42px;
    &:hover {
      cursor: pointer;
      background-color: #E2E2E2;
      border-radius: 42px;
    }
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

.postSettings, .commentSettings {
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

.commentSettings {
  padding: 0px;
  width: 110px;
  margin: auto;
  margin-left: 0px;
  &Menu {
    width: 20px;
    height: 29px;
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

#modifyPostPopup, #deletePostPopup, #deleteCommentPopup {
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

.close {
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

p[data-isLiked="false"] {

}

p[data-isLiked="true"] {
  color: #0080FF;
  font-weight: bold;
}

.numberOfLikes {
  padding: 0px 20px 0px 20px;
  text-align: left;
  font-weight: normal;
}
</style>
