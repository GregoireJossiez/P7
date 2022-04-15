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
    logIn(context, user) {

      fetch('http://192.168.0.18:3000/api/auth/login', {
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
    signIn(context, user) {

      fetch('http://192.168.0.18:3000/api/auth/signup', {
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
    newPost(context, post) {

      // const token = JSON.parse(localStorage.getItem("token"))

      console.log("userId: " + post.userId);
      console.log("token: " + post.token);

      console.log(post);

      fetch('http://192.168.0.18:3000/api/post/', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + post.token
        },
      }).then(function(response) {
        return response.json({ response });
      }).catch((err) => {
        console.log("Problème avec fetch : " + err.message);
      })
    },
    addLike(context, like) {
      console.log(like);

      fetch('http://192.168.0.18:3000/api/post/like/', {
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
    }
  },
  modules: {
  },
})
