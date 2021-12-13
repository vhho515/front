<template>
  <v-main>
    <!-- Welcome title -->
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" align="center" justify="center">
          <blockquote>
            Welcome {{validUserName}}!
            <footer>
              <small>
                <em>&mdash; Ever great post begins with you!</em>
              </small>
            </footer>
          </blockquote>
        </v-col>
        <v-col  cols="12" md="10" lg="10" align="center" justify="center">
          <v-alert v-if="showMsg === 'new'"
                   dismissible
                   :value="true"
                   type="success"
          >
            New Post has been added.
          </v-alert>
          <v-alert v-if="showMsg === 'update'" dismissible
                   :value="true"
                   type="success"
          >
            Post information has been updated.
          </v-alert>
          <v-alert v-if="showMsg === 'deleted'" dismissible
                   :value="true"
                   type="success"
          >
            Selected Post has been deleted.
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data table -->
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" v-resize="onResize">
            <v-data-table
              :headers="headers"
              :items="posts"
              class="elevation-1"
              style="max-height: 300px; overflow-y: auto"
              v-if="isMobile"
            >
                    <template v-slot:item="props">
                      <tr>
                        <td align="left">{{ props.item.title }}</td>
                        <td align="left">{{ props.item.name }}</td>
                        <td align="left">{{ props.item.body }}</td>
                        <td align="left">{{ props.item.year }}</td>

                        <td align="center"><v-icon @click="updatePost(props.item)">mdi-pencil</v-icon></td>
                        <td align="center"><v-icon @click="deletePost(props.item)">mdi-delete</v-icon></td>
                      </tr>
                    </template>
              </v-data-table>
              <v-data-iterator
                :items="posts"
                hide-default-footer
                v-else
              >
                <template v-slot:default="{ items, isExpanded, expand }">
                  <v-row>
                    <v-col
                      v-for="item in items"
                      :key="item.name"
                      cols="12"
                    >
                      <v-card>
                        <v-card-title class="pb-0 pt-0 pl-0">
                          <v-col cols="9" class="text-left body-2 text-truncate">{{ item.name }}</v-col>
                          <v-col cols="3" class="text-center">
                            <v-card-actions>
                              <v-icon @click="updatePost(item)" class="small">mdi-pencil</v-icon>
                              <v-icon @click="deletePost(item)" class="small">mdi-delete</v-icon>
                              <v-icon @click.native="expand(item, !isExpanded(item))" class="small">mdi-dots-horizontal</v-icon>
                            </v-card-actions>
                          </v-col>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-list v-show="isExpanded(item)" dense>
                          <v-list-item>
                            <v-list-item-content class="align-end">{{ item.body }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>Year:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.year }}</v-list-item-content>
                          </v-list-item>

                        </v-list>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>
              </v-data-iterator>
              <v-btn class="blue mt-4 white--text" @click="addNewPost">Add Post</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>


<script>

  import router from '../router';
  import {APIService} from '../http/APIService';
  const apiService = new APIService();

  export default {
    name: "PostList",
    data: () => ({
      posts: [],
      validUserName: "Guest",
      movieSize: 0,
      showMsg: '',
      isMobile: false,
      headers: [
        {text: 'Title', sortable: false, align: 'left'},
        {text: 'Author', sortable: false, align: 'left',},
        {text: 'Body', sortable: false, align: 'left',},
        {text: 'Year', sortable: false, align: 'center',},
        {text: 'Update', sortable: false, align: 'center',},
        {text: 'Delete', sortable: false, align: 'center',},
      ],

    }),
    mounted() {
      this.getPost();
      this.showMessages();
    },
    methods: {
      onResize() {
          if (window.innerWidth > 600)
            this.isMobile = true;
          else
            this.isMobile = false;
        },
      showMessages(){
        console.log(this.$route.params.msg)
        if (this.$route.params.msg) {
          this.showMsg = this.$route.params.msg;
        }
      },
          getPost() {
        apiService.getPostList().then(response => {
          this.posts = response.data.data;
          console.log(response.data.data);
          console.log(response.data);
          this.postSize = this.post.length;
          if (localStorage.getItem("isAuthenticates")
            && JSON.parse(localStorage.getItem("isAuthenticates")) === true) {
            this.validUserName = JSON.parse(localStorage.getItem("log_user"));
          }
        }).catch(error => {
          if (error.response.status === 401) {
            localStorage.removeItem('isAuthenticates');
            localStorage.removeItem('log_user');
            localStorage.removeItem('token');
            router.push("/auth");
          }
        });
      },
      addNewPost() {
        if (localStorage.getItem("isAuthenticates")
          && JSON.parse(localStorage.getItem("isAuthenticates")) === true) {
          router.push('/post-create');
        } else {
          router.push("/auth");
        }
      },
      updatePost(post) {
        router.push('/post-create/' + post.pk);
      },
      deletePost(post) {
        apiService.deletePost(post.pk).then(response => {
          if (response.status === 204) {
            router.push('/post-list/deleted/')
            this.getPost()
          }
        }).catch(error => {
          if (error.response.status === 401) {
            localStorage.removeItem('isAuthenticates');
            localStorage.removeItem('log_user');
            localStorage.removeItem('token');
            router.push("/auth");
          }
        });
      }
    }
  };
</script>
