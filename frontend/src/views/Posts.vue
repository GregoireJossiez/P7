<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
  <div id="Posts">
    <h1>Most recents posts</h1>
    <!-- <div class="post">
      <p class="author">name familyname</p>
      <p class="date">15h</p>
      <div class="content">
        <p>This is the content of my post !</p>
      </div>
      <div class="reaction">
        <p class="likes">Like <span class="numberOfLikes">5</span></p>
        <img class="likeBtnImg" src="../assets/like-button.png" alt="">
      </div>
    </div> -->
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

      const $postAuthor = document.createElement("p")
      $postAuthor.classList.add("author")
      $postAuthor.textContent = post.authorName + " " + post.authorFamilyName

      const $postDate = document.createElement("p")
      $postDate.classList.add("date")
      $postDate.textContent = post.createdAt

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

      $post.appendChild($postAuthor)
      $post.appendChild($postDate)

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

    const main = async () => {

      // Retrieve all posts from DB

      const getAllPosts = async () => {
        fetch('http://192.168.0.18:3000/api/post/', {
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

<style lang="css">

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
  max-width: 800px;
}

.post {
  margin: auto;
  padding: 5px 20px 5px 20px;
  width: 100%;
  height: auto;
  border: 2px solid black;
  border-radius: 15px
}

.author, .date {
  text-align: left;
  padding: 0px;
}

.date {
  font-size: 12px;
}

.content {

}

.likes {
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
  text-align: left;
  font-weight: normal;
}
</style>
