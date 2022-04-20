<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
  <div id="Posts">
    <h1>Most recents posts</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {

  },
  mounted() {
    // const token = this.$store.state.user.token

    // Retrieving user data in the localStorage

    const user = JSON.parse(localStorage.getItem("user"))
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

      const $postAuthor = document.createElement("p")
      $postAuthor.classList.add("author")
      $postAuthor.textContent = post.authorName + " " + post.authorFamilyName

      const $postDate = document.createElement("p")
      $postDate.classList.add("date")
      $postDate.textContent = post.createdAt

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

      const $postImage = document.createElement("img")
      $postImage.classList.add("image")
      $postImage.setAttribute("src", post.imageUrl)

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

      $postInfo.appendChild($postAuthor)
      $postInfo.appendChild($postDate)

      if (post.userId === user.id) {
        $settingsMenu.appendChild($modify)
        $settingsMenu.appendChild($delete)
      }
      $settingsMenu.appendChild($report)

      $postSettingsMenu.appendChild($settingsMenu)

      $postSettings.appendChild($postSettingsMenu)

      $postTop.appendChild($postInfo)
      $postTop.appendChild($postSettings)

      $post.appendChild($postTop)

      if (post.imageUrl != null) {
        $postContent.appendChild($postImage)
      }
      $postContentDiv.appendChild($postContent)

      $post.appendChild($postContentDiv)

      $postReaction.appendChild($numberOfLikes)

      $postReaction.appendChild($postLikes)

      $post.appendChild($postReaction)

      return $post
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
      console.log("MODIFY" + postid);
    }

    const deletePost = async (e) => {
      let post = e.target.closest(".post")
      let postid = e.target.closest(".post").attributes.postid.value
      console.log("DELETE" + postid);

      user.postid = postid

      this.$store.dispatch('deletePost', user).then((res) => {
        console.log("THEN RES");
        console.log(res);
        post.remove()
      }).catch((error) => {
        console.log("CATCH ERROR");
        console.log(error);
      })
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
  }
}
</script>

<style lang="scss">

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;

}
textarea, button {
  margin: auto;
  width: 500px;
}

p {
  margin: 0px;
  padding: 0px;
}

#Posts {
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 1000px;
}

.post {
  margin: auto;
  padding: 5px 0px 5px 0px;
  width: 90%;
  height: auto;
  border: 1px solid black;
  border-radius: 15px
}

.postTop {
  display: flex;
  justify-content: space-between;
}

.author, .date {
  text-align: left;
  padding: 0px 20px 0px 20px;
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
  width: 200px;
  background-color: white;
  border: 1px solid black;
  box-shadow: 0px 0px 5px lightgrey;
  right: 0px;
}

ul {
  list-style: none;
  font-size: 15px;
  li {
    &:hover {
      background-color: lightgrey;
    }
  }
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
