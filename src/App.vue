<template>
  <div id="app">
    <div class="nav" style="position: absolute; height:35px;">
      <h1>Wiki-Bot</h1>
      <span class="spacer" />
      <router-link v-if="this.$store.getters.isAuthorized" @click="logout()" to="#">
        Logout
      </router-link>
      <a v-else href="https://discord.com/oauth2/authorize?client_id=740533311515918347&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Flogin&response_type=code&scope=identify%20guilds">
        Login
      </a>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('setToken', localStorage.getItem('token'));
  },
  methods: {
    logout() {
      this.$store.dispatch('setToken', null);
      location.assign('/');
    },
  },
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  height: 100%;
}

.nav {
  background-color: #747065;
  width: 100%;
  margin: 0;
  display: flex;

  h1 {
    margin: 0;
    margin-left: 10px;
  }

  a {
    font-size: 30px;
    margin-right: 10px;
    color: #fadc37;
    text-decoration-color: #fadc37;
  }
}

.spacer {
  flex: 1 1 auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  //padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
