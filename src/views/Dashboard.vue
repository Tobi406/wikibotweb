<template>
  <main class="dashboard">
    <div v-if="this.$store.getters.isAuthorized" class="flex">
      <aside style="flex: 1;width:30%; overflow-y: auto; position: absolute; height: 100%;margin-top:35px;max-height:calc(100% - 35px);background-color:#897b6c;">
        <ul style="padding-left:0;">
          <li class="entry full-width" v-for="server in servers" :key="server.information.id">
            <router-link style="max-width:100%;width:100%;max-height:100%;height:100%;" :to="`/dashboard/${server.information.id}`" @click.native="selectServer(server.information.id)">
              <div class="flex link-flex" style="padding-left:20px;">
                <img :src="imageUrl(server.information.id, server.information.icon)" height="70px" style="border-radius:50%;" />
                <p style="align-self:center;margin-left:10px;">{{ server.information.name }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </aside>
      <article style="margin-left: 30%;flex: 2;overflow-y: auto; position: absolute;width: 70%; height: 100%;margin-top:35px;max-height:calc(100% - 35px);background-color:#dad7cd;">
        <div v-if="JSON.stringify(currentServer) !== JSON.stringify(currentOriginalServer)" style="position: fixed; margin-top:92vh; margin-left:10px;border-radius:10px;width:calc(100% - 30% - 40px);border:2px solid #fdebcb;background-color:#b7a990;padding-top:5px;padding-bottom:5px;">
            Changes detected. <button @click="save()">Save</button><button @click="discardChanges()">Discard</button>
        </div>
        <div v-if="currentServer">
          <h1>Change settings for {{ currentServer.information.name }}</h1>
          <p class="bold">Changes? {{ JSON.stringify(currentServer) !== JSON.stringify(currentOriginalServer) }}</p>
          <pre style="text-align: left;" v-text="JSON.stringify(addValues, null, 2)" />
          <table>
            <tr>
             <td>
              <p class="bold">Prefix:</p> 
             </td>
             <td>
               <input v-model="currentServer.data.prefix" />
             </td>
            </tr>
            <tr>
             <td>
              <p class="bold">Wiki:</p> 
             </td>
             <td>
               <input v-model="currentServer.data.wiki" />
             </td>
            </tr>
            <tr>
              <td>
                <p class="bold">Language:</p>
              </td>
              <td>
                <select v-model="currentServer.data.lang">
                  <option v-for="(value, name) in langs.names" :key="name" :value="name" :selected="currentServer.data.lang == name">{{ name }} - {{ value }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <p class="bold">Inline:</p>
              </td>
              <td>
                <input style="text-align: left;" type="checkbox" id="inline" v-model="currentServer.data.inline" />
              </td>
            </tr>
            <tr>
              <td>
                <p class="bold" style="">Verification:</p>
              </td>
              <td>
                <div v-for="(verification, index) in currentServer.verifications" :key="index">
                  <pre style="text-align: left;" v-text="JSON.stringify(verification, null, 2)" />
                
                  <p class="bold">Verification {{ index }}</p><button @click="removeVerification(index)">Remove</button>
                  <br />
                  
                  <table>
                    <tr>
                      <td>
                        <p style="vertical-align: text-top;">Channel{{ verification.channel.split('|').filter(v => v !== '').length > 1 ? 's' : ''}}:</p>
                      </td>
                      <td>
                        <select multiple @change="saveChannels($event, index)">
                          <option v-for="channel in textChannels" :key="channel.id" :value="channel.id" :selected="verification.channel.split('|').filter(v => v !== '').includes(channel.id)">{{ channel.name }}</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Role{{ verification.role.split('|').length > 1 ? 's' : '' }}:</p>
                      </td>
                      <td>
                        <select multiple @change="saveRoles($event, index)">
                          <option v-for="role in roles" :key="role.id" :value="role.id" :selected="verification.role.split('|').includes(role.id)">{{ role.name }}</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Editcount:</p>
                      </td>
                      <td>
                        <input v-model="verification.editcount" type="number" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Usergroup:</p> <!-- Add s -->
                      </td>
                      <td>
                        {{ verification.usergroup.startsWith('AND') }}
                        <label for="andRadio">And</label>

                        <input type="radio" id="andRadio" @change="changeAddValues($event, verification.guild, index)" :checked="changeAddValues[verification.guild][index]">
                        <label for="orRadio">Or</label>
                        <input type="radio" id="orRadio" @change="changeAddValues($event, verification.guild, index)" :checked="!changeAddValues[verification.guild][index]">
                        <br />
                        <input :id="`${index}-new`">
                        <button @click="addGroup(verification.guild, index)">Add group</button>
                        <div :key="index2" v-for="(group, index2) in verification.usergroup.replace('AND|', '').split('|')">
                          <br />
                          <input :value="group" :id="`${index}-${index2}`" @change="changeGroup($event, verification.guild, index, index2)" />
                          <label :for="`${index}-${index2}`" @click="removeGroup(verification.guild, index, index2)">&nbsp;&nbsp;X</label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Accountage:
                      </td>
                      <td>
                        <input v-model="verification.accountage" type="number" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Rename:
                      </td>
                      <td>
                        <input @change="saveRename($event, index)" v-model="verification.rename" type="checkbox" />
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
          <pre style="text-align: left;" v-text="JSON.stringify(textChannels, null, 2)" />
          <pre style="text-align: left;" v-text="JSON.stringify(currentServer, null, 2)" />

        </div>
        <div v-else-if="error" class="warning">
          {{ error }}
        </div>
        <div v-else>
          <p>Please select a server!</p>
        </div>
      </article>
    </div>
    <div v-else class="warning centered">
      Please login
    </div>
  </main>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      error: false,
      addValues: {},
      groups: {},
    }
  },
  computed: {
    servers() {
      return this.$store.getters.servers;
    },
    currentServer() {
      return this.$store.getters.currentServer;
    },
    currentOriginalServer() {
      return this.$store.getters.currentOriginalServer;
    },
    langs() {
      return this.$store.getters.langs;
    },
    textChannels() {
      return this.currentServer.channels.filter(channel => channel.type === 'text').sort((a, b) => {
        return a.rawPosition - b.rawPosition;
      });
    },
    roles() {
      return JSON.parse(JSON.stringify(this.currentServer.roles)).sort((a, b) => {
        return a.rawPosition - b.rawPosition;
      }).reverse();
    },
  },
  methods: {
    imageUrl(id, icon) {
      if (icon == null) {
        return "https://gamepedia.cursecdn.com/commons_hydra/9/93/Cursebot.png";
      } else {
        return `https://cdn.discordapp.com/icons/${id}/${icon}.webp`;
      }
    },
    save() {
      console.log(JSON.stringify(this.currentServer, null, 2));
      console.log(JSON.stringify(this.currentOriginalServer, null, 2));
    },
    discardChanges(id) {
      this.$store.dispatch('resetCurrentServer', this.currentServer.information.id);
      this.setupGroups();
    },
    removeVerification(index) {
      this.currentServer.verifications.splice(index, 1);
    },
    saveChannels(event, index) {
      this.currentServer.verifications[index].channel = `|${Array.apply(null, event.target.selectedOptions).map(o => o.value).join('|')}|`;
    },
    saveRoles(event, index) {
      this.currentServer.verifications[index].role = Array.apply(null, event.target.selectedOptions).map(o => o.value).join('|');
    },
    saveRename(event, index) {
      this.currentServer.verifications[index].rename = event.target.checked ? 1 : 0;
    },
    changeGroup(event, guild, index, index2) {
      index += 1;
      if (!this.groups[guild]) this.groups[guild] = {};
      if (!this.groups[guild][index]) this.groups[guild][index] = [];
      if (event.target.value !== '') this.groups[guild][index][index2] = event.target.value;
      else this.removeGroup(guild, index-1, index2);
      this.setGroups(guild, index);
    },
    changeAddValues(event, guild, index) {
      //this.addValues[guild][index] = !this.addValues[guild][index];
      console.log(this.addValues[guild][index]);
      this.setGroups(guild, index + 1);
    },
    removeGroup(guild, index, index2) {
      index += 1;
      this.groups[guild][index].splice(index2, 1);
      this.setGroups(guild, index);
    },
    addGroup(guild, index) {
      index += 1;
      const value = document.getElementById(`${index-1}-new`).value;
      if (value === '') return;
      this.groups[guild][index].push(value);
      this.setGroups(guild, index);
    },
    setGroups(guild, index) {
      this.currentServer.verifications[index - 1].usergroup = (this.addValues[guild][index] ? 'AND|' : '' ) + this.groups[guild][index].join('|');
    },
    selectServer(id) {
      this.$store.dispatch('setCurrentServer', id);
    },
    setupGroups() {
      Object.values(this.servers).forEach(s => {
        s.verifications.forEach(v => {
          if (!this.groups[s.information.id]) this.groups[s.information.id] = {};
          if (!this.groups[s.information.id][v.configid]) this.groups[s.information.id][v.configid] = [];
          this.groups[s.information.id][v.configid] = v.usergroup.replace('AND|', '').split('|')
        });
      });
    },
    setupAddValues() {
      Object.values(this.servers).forEach(s => {
        s.verifications.forEach(v => {
          if (!this.addValues[s.information.id]) this.addValues[s.information.id] = [];
          if (!this.addValues[s.information.id][v.configid]) this.addValues[s.information.id][v.configid - 1] = v.usergroup.startsWith('AND');
        });
      });
    },
    async getServers() {
      if (this.$store.getters.isAuthorized) {
        const axios = require('axios');
        console.log(this.$store.getters.token);
        await axios.post('http://localhost:3030/guilds', {
          token: this.$store.getters.token,
        })
          .then(response => {
            console.log(response);
            this.$store.dispatch('setServers', response.data.servers);
            this.$store.dispatch('setLangs', response.data.langs);
            this.setupGroups();
            this.setupAddValues();
          })
          .catch(error => console.error(error));
      }
      if (this.$route.params.id) {
        const id = this.$route.params.id;
        console.log(this.servers);
        console.log(this.servers[id] !== undefined);
        if (this.servers[id] !== undefined) {
          this.$store.dispatch('setCurrentServer', id);
        } else {
          this.error = 'Server not available';
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$store.dispatch('setToken', this.$route.query.token);
    }
    this.getServers();
  },
}
</script>

<style lang="scss">
.centered {
  text-align: center;
  width: 100%;
  max-width: 100%;
}

.warning {
  border: 2px red;
}

.bold {
  font-weight: bold;
}

td {
  text-align: left;
  vertical-align: text-top;
}

.flex {
  display: flex;
  
}

.entry {
  display: unset;
}

.full-width {
  width: 100%;
  max-width: 100%;
}

.link-flex:hover {
  background-color: #a2917f;
}
.router-link-exact-active > .link-flex {
  background-color: #d2bda7;
}
</style>
