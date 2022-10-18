<template>
  <v-navigation-drawer
      app
      permanent
    >
      <v-sheet
        color="grey lighten-4"
        class="pa-4"
      >
        <v-avatar color="indigo">
          <input
            type="file"
            ref="fileinput"
            accept="image/.jpg, image/jpeg, image/png"
            style="display: none;"
            @change="updateIcon"
          ><!--acceptは受け入れ可能なファイルの種類を登録できる-->

          <v-icon
            dark
            @click="changeIcon"
            v-if="!IconUrl"
            >
              mdi-account-circle
          </v-icon>
          <img :src="IconUrl" alt="" v-if="IconUrl">
        </v-avatar>

        <div>{{ loginUser ? loginUser.displayName : 'Guest' }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text, to] in links"
          :key="icon"
          :to="to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-btn @click="logout">ログアウト</v-btn>
        </v-list-item>

      </v-list>

    </v-navigation-drawer>
</template>


<script>
import { auth, storage } from '@/firebase/firebase';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL }  from 'firebase/storage';


export default {
  data: () => ({
    // drawer: null,
    links: [
      ['mdi-inbox-arrow-down', 'Inbox', '/'],
      ['mdi-send', 'Chat Room', '/chat'],
      ['mdi-delete', 'Trash', '/'],
      ['mdi-alert-octagon', 'Spam', '/'],
    ],
    loginUser: null,
    IconUrl: '',
  }),
  mounted() {
    //ログインユーザーのセッションストレージにある情報を取得し、ジェイソンパースして形を戻す
  this.loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
  },
  methods: {
    logout() {
      const authApp = auth;
      signOut(authApp).then(() => {
        console.log('success logout')
        this.$router.push('login')
      }).catch((error) => {
        console.log('error logout', error)
      }) 
    },
    changeIcon() {
      this.$refs.fileinput.click(); //input'file'を見えないようにして、アイコンにクリックイベントをつけて、refsで値をとって、クリックして発動するようにした
    },
    updateIcon() {
      const userAuth = this.userAuth();
        if(!userAuth) {
          sessionStorage.removeItem('userInfo');
          this.$router.push('/login');
        }
        //以下は、Storageへの画像データのアップロード fireStorageのルールを追加すること。'if request.auth != null;' じゃないと、大量書き込みで多額の請求が来る可能性がある
        //フォームからファイルを取得
        const file = this.$refs.fileinput.files[0];
        //画像ファイルへの参照を作成
        const userImageRef = ref(storage, `/user/${file.name}`)
        // console.log(userImageRef)
        //画像ファイルのアップロードメソッド
        uploadBytesResumable(userImageRef, file)
        .then(snapshot => {
          console.log('Upload a blob or file' ,snapshot);
          getDownloadURL(snapshot.ref)
          .then(downloadURL => {
            console.log('Success', downloadURL);
            const authState = auth;
            onAuthStateChanged(authState, user => {
              if(user) {
                updateProfile(user, {
                  photoURL: downloadURL
                })
                .then(() => {
                  console.log('プロフィール画像更新!', user);
                  this.loginUser.photoURL = downloadURL
                  sessionStorage.setItem('userInfo', JSON.stringify(this.loginUser));
                  this.IconUrl = downloadURL
                })
                .catch(error => {
                  console.log('プロフィール画像更新失敗', error);
                })
              }
            })
          })
          .catch(error => {
            console.log('Error', error);
          })
          .catch(error => {
            console.log('Error', error)
          })
        })
    },
    userAuth() {
      const userAuthApp = auth;
      return onAuthStateChanged(userAuthApp, user => { //オースからユーザー情報を取得
        return user; 
      })
    }
  },
};
</script>
