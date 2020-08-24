<template>
  <main class="home">
    <div v-html="readme" />
  </main>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data() {
    return {
      readme: '',
    }
  },
  mounted() {
    const md = require('markdown-it')();
    const axios = require('axios');
    axios.get('https://raw.githubusercontent.com/Markus-Rost/discord-wiki-bot/master/README.md')
      .then(response => {
        this.readme = md.render(response.data);
      })
      .catch(error => console.error(error));
  }
}
</script>
