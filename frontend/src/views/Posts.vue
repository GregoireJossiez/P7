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
      $postLikes.textContent = "Like "

      const $numberOfLikes = document.createElement("span")
      $numberOfLikes.classList.add("numberOfLikes")
      $numberOfLikes.textContent = post.likes

      $post.appendChild($postAuthor)
      $post.appendChild($postDate)

      $postContentDiv.appendChild($postContent)

      $post.appendChild($postContentDiv)

      $postLikes.appendChild($numberOfLikes)

      $postReaction.appendChild($postLikes)

      $post.appendChild($postReaction)

      return $post
    }

    // Add likes function

    const addLikes = async (e) => {
      let target = e.target.closest(".post")
      let postid = +target.attributes.postid.value

    const like = {
      postId: postid,
      token: token
    }

      this.$store.dispatch('addLike', like);
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
            $posts.appendChild(createPost(post))
          });
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
  width: 50px;
}

.likes:hover {
  font-weight: bold;
  cursor: pointer;
}

.numberOfLikes {
  font-weight: normal;
}

</style>
