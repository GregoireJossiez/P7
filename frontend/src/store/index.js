import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      userId: "",
      email: "",
      name: "",
      familyName: "",
      password: "",
      token: ""
    }
  },
  getters: {
  },
  mutations: {
    updateUser (state, user) {
      state.user.userId = user.id,
      state.user.email = user.email,
      state.user.name = user.name,
      state.user.familyName = user.familyName,
      state.user.password = user.password,
      state.user.token = user.token
    }
  },
  actions: {

    // Login function

    logIn(context, user) {

      fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      }).then((response) => {
         return response.json({ response });
      }).then((data) => {
        console.log(data);
        user.id = data.userId
        user.name = data.name
        user.familyName = data.familyName
        user.token = data.token

        localStorage.setItem("user", JSON.stringify(user))
        context.commit("updateUser", user)
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // SignIn function

    signIn(context, user) {

      fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // New Post function

    newPost(context, formData) {

      // const token = JSON.parse(localStorage.getItem("token"))

      // console.log("userId: " + post.userId);
      // console.log("token: " + post.token);

      console.log(formData);
      console.log(formData.get("content"));

      fetch('http://localhost:3000/api/post/', {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + formData.get("token")
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // Add Like function

    addLike(context, like) {
      console.log(like);

      fetch('http://localhost:3000/api/post/like/', {
        method: 'POST',
        body: JSON.stringify(like),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + like.token
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // Modify Post function

    modifyPost(context, post) {
      console.log(post);
      console.log(post.get("imageUrl"));

      fetch(`http://localhost:3000/api/post/${post.get("id")}`, {
        method: 'PUT',
        body: post,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + post.get("token")
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // Delete Post function

    deletePost(context, user) {
      console.log(user);

      fetch(`http://localhost:3000/api/post/${user.postid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + user.token
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },

    // Modify User function

    modifyUser(context, post) {
      console.log(post);
    },

    // Delete User function

    deleteUser(context, user) {
      console.log(user);

      fetch(`http://localhost:3000/api/post/user/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + user.token
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },
  },
  modules: {
  },
})
