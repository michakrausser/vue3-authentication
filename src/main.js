import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import axios from 'axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created() {
    /*
     * if we refresh or reload our browser the vuex will lose all our user data and the user had to relogin
     * for this reason we look for user data in our localStorage and save it in vuex
     */
    const userString = localStorage.getItem( 'user' )
    if ( userString ) {
      const userData = JSON.parse( userString )
      this.$store.commit( 'SET_USER_DATA', userData )
    }
    /*
    * It’s possible for an ill-intentioned person to save a fake token to local storage.
    * While this might allow them to navigate to certain parts of our app,
    * if they navigate somewhere that makes an API call for private resources,
    * we can intercept that request and log them out.
    * For that reason we add the method axios.interceptors.response.use()
    */
    axios.interceptors.response.use(
      response => response,
      error => {
        if ( error.response.status === 401 ) {
          this.$store.dispatch( 'logout' )
        }
        return Promise.reject( error )
      }
    )
  },
  render: h => h(App)
}).$mount('#app')
