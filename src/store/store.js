import router from '@/router';
import { signInButton } from 'aws-amplify';
import axios from 'axios';
import { response } from 'express';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    donatedProducts: [],
    upcycledProducts: [],
    soldProducts: [],
    blogs: [],
    user: null,
    signedIn: false,
    error: null,
    loading: false
  },
  mutations: {
    setDonatedProducts(state, payload) {
      state.donatedProducts = payload;
    },
    setUpcycledProducts(state, payload){
      state.upcycledProducts = payload;
    },
    setSoldProducts(state, payload){
      state.soldProducts = payload
    },
    setBlogs(state, payload){
      state.blogs = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSignIn(state){
      state.signedIn = true;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {


    //*USER Actions*/
    loadUser({commit}, payload){
      commit("setLoading", true);
      commit("clearError");
      console.log(this.state.user);
      console.log(this.state.signedIn);
    },

    //Sign User In
    signUserIn({ commit }, payload) {
        commit("setLoading", true);
        commit("clearError");
        axios.post('http://localhost:5000/users/login', {
          email: payload.email,
          password: payload.password
        }).then(user => {
          console.log(user);
          const newUser = user.data;
          const refreshToken = newUser.refreshToken;
          const token = newUser.token;
          token !== undefined && commit("setToken", token);
          const now = new Date();
          const item = {
            auth: { refreshToken, token},
            expiry: now.getTime() + 1000 * 60 * 60 * 24 * 30 };
          refreshToken !== undefined && (localStorage.setItem("session", JSON.stringify(item)));
          // CODE GOES HERE??
  
          if(newUser.message != 'login successful'){
            commit('setError', newUser.message);
            commit("setLoading", false);
          }else{
            console.log(newUser);
            commit("setUser", newUser);
            commit("setSignIn", true);
            commit("setLoading", false);
          }
        })
      },


    // signIn({commit}, payload){
    //   commit("setLoading", true);
    //   commit("clearError");
    //   return new Promise((resolve, reject) => {
    //     axios.post('https://refunkbackend.herokuapp.com/users/login', {
    //       email: payload.email,
    //       password: payload.password
    //     }).then(response => {

    //     })
    //   })

    // },

    registerUser({commit}, payload){
      commit("setLoading", true);
      commit("clearError");
      axios.post('http://localhost:3000/users/register', payload)
      .then(() => {
        this.dispatch('signUserIn', {
          email: payload.email,
          phoneNmuber: payload.phoneNmuber,
          firstAddress: payload.firstAddress,
          secondAddress: payload.secondAddress,
          county: payload.county,
          eircode: payload.eircode,
          password: payload.password,
          role: 'user',
          confirmPassword: payload.confirmPassword,
        })
        commit("setLoading", false);

      }).catch(error => {
        commit("setLoading", false);

        // const message =
        console.log(error);
      })
      console.log("Registered")
    },

    logout({commit}, payload){
      //POST request to log user out
    },


    /**
     *
     * DONATED ACTIONS
     */
    loadDonatedItems({commit}){
      commit("setLoading", true);
      axios.get('http://localhost:3000/donated-products')
      .then(res => res.data)
      .then(items => {
        console.log(items);
        commit("setLoading", false);
        commit('setDonatedProducts', items)
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },
// https://refunkbackend.herokuapp.com/donated-products
    postDonatedItem({commit},payload){
      commit("setLoading", true);
      axios.post('http://localhost:3000/create-donation',{
        // userId: this.state.user,
        title: payload.title,
        color: payload.color,
        file: payload.file,
        material: payload.material,
        itemType: payload.itemType,
        quantity: payload.quantity,
        description: payload.description
      }).then(() => {
        router.push('/upcycle-waiting-for-approval')
        commit("setLoading", false);
      }).catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        alert('Server is down. Please come back later and try again')
        console.log(error)
      })
    },

    deleteDonatedItem({commit},payload){
      commit("setLoading", true);
      axios.delete('http://localhost:3000/donated-products/'+payload).then(() => {
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },

    /**
     *
     * UPCYCLED ACTIONS
     */
    loadUpcycledItems({commit}){
      commit("setLoading", true);
      axios.get('http://localhost:3000/upcycled-products')
      .then(res => res.data)
      .then(items => {
        console.log(items);
        commit("setLoading", false);
        commit('setUpcycledProducts', items)
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },

    postUpcycledItem({commit},payload){
      commit("setLoading", true);
      console.log(payload.title);
      axios.post('http://localhost:3000/create-upcycled',{
        userId: this.state.user,
        title: payload.title,
        file: payload.file,
        color: payload.color,
        itemType: payload.itemType,
        price: payload.price,
        quantity: payload.quantity,
        material: payload.material,
        description: payload.description
      }).then(() =>{
        router.push('/upcycle-waiting-for-approval')
        commit("setLoading", false);
      }).catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        alert('Server is down. Please come back later')
        console.log(error);
      })
    },

    deleteUpcycledItem({commit},payload){
      commit("setLoading", true);
      axios.delete('http://localhost:3000/upcycled-products/'+payload).then(() => {
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },


    /**
     *
     * BLOGS
     */
    loadBlogs({commit}){
      commit("setLoading", true);
      axios.get('http://localhost:3000/blogs')
      .then(res => res.data)
      .then(blogs => {
        console.log(blogs);
        commit("setLoading", false);
        commit('setBlogs', blogs)
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },

    postBlog({commit}, payload){
      commit("setLoading", true);
      console.log(payload.title)
      axios.post('http://localhost:3000/blogs',{
      title: payload.title,
      content: payload.content
    }).then(() => {
      commit("setLoading", false);
    })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      });
    },

    /**
     *
     * PAYMENTS
     */

    SubmitPayment({commit}, payload){
      commit("setLoading", true);
      axios.post("https://stripe-upfunk.herokuapp.com/reFunk-pay", payload)
      .then((res) => {
        console.log(res.data);
        // console.log(res.data.charge)
        if(res.data.charge){
          this.dispatch('StorePayment', payload);
          console.log('Success')
        }
        else{
          alert('Please make sure all fields are valid and try again')
          console.log('Error with payment')
        }
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      })
    },

    StorePayment({commit}, payload){
      commit("setLoading", true);
      axios.post('http://localhost:3000/sales', {
        title: payload.name,
        price: payload.amount,
        buyersEmail: payload.email,
        AddressLine1: payload.address.line1,
        AddressLine2: payload.address.line2,
        county: payload.address.county,
        eircode: payload.address.eircode,
        upcycledItem: payload.upcycledItem,
        deliveryMethod: payload.deliveryMethod
      })
      .then((res) => {
        console.log(res.data);
        // console.log(res.data.id);
        router.push(`/payment-confirmation/${res.data.id}`)
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setLoading", false);
        commit("setError", error);
        console.log(error);
      })
    },

    loadSales({commit}){
      axios.get('http://localhost:3000/sales')
      .then(res => res.data)
      .then(sales => {
        console.log(sales);
        commit("setLoading", false);
        commit('setSoldProducts', sales)
      })
    },

    /**
     * CLEAR ERROR
     */
    clearError({ commit }) {
      commit("clearError");
    }
  },
  getters:{
    /**
     * 
     * @param {*} session 
     */
    
    session(){
        if(process.browser){
        const userSession = localStorage.getItem("session");
        const item = JSON.parse(userSession);
        const {auth} = item;
        const token = auth.token;
        item !== null && ( commit('setToken', token));          
        const now = new Date()
        // if the item doesn't exist, return null
        if (!item) {
            commit('setSignIn', false);
                return null
                }
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem("session");
            commit('setSignIn', false);
                return null
            }else {
                return commit('setSignIn', true)
            }
        }
        return this.state.signedIn;
        },

    /**
     * LOADING
     */
    loading(state) {
      state.loading;
    },

    //** ERROR */
    error(state) {
      return state.error;
    }
  },
  modules: {
  },
});
