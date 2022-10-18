<template>
  <div id="login">
    <v-card class="login__container">
      <v-card-title class="login__ttl">Login</v-card-title>
      <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
      <v-btn
        to="/signup"
        color="light-blue"
        text
      >
      新規登録はこちら
      </v-btn>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
        ></v-text-field>

        <v-btn
          class="login__btn"
          color="success"
          @click='login'
        >Login</v-btn>

        <v-btn
          @click='clear'
        >Clear</v-btn>

        <v-alert
          dense
          text
          type="success"
          class="success__message"
          v-show="message"
        >
          {{ message }}
        </v-alert>

      </v-form>
      <!-- <p>{{valid}}</p> -->

    </v-card>
  </div><!--#login-->
</template>

<script>
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+\..+/.test(v) || 'メールアドレスの記述形式が不正です',
    ],
    password: '',
    message: ''
  }),
  mounted() {
    if(localStorage.message) {
      this.message = localStorage.message
      localStorage.message = ''
    }
  },
  methods: {
    login() {
      const authApp = auth;
      signInWithEmailAndPassword(authApp, this.email, this.password) //Authに送って合っているか確認
        .then((response) => {
          // Signed in
          const user = response.user;
          console.log(`success Login`, user)
          this.$refs.form.reset(); //refはフォームに設定しておくと一気に取得できる
          //ユーザー情報の取得

          const userInfo = {
            displayName: user.displayName,
            email: user.email, //userInfoという名前で、userInfoをジェイソンに変えて送る。
            photoURL: user.photoURL
          }
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo)) 
          this.$router.push('/')
        })
        .catch((error) => {
          console.log(`error login`, error)
          // const errorCode = error.code;
          // const errorMessage = error.message;
        });
    },
    clear() {
      this.$refs.form.reset() //レフを設定しておくと、値が取れる
    },
  }
}
</script>


<style scoped>
#login {
  min-height: 100vh;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* padding: 40px; */
}
.login__container {
  width: 400px;
  padding: 30px;
  /* margin: 0 auto; */
}
.login__ttl {
  font-size: 2.2rem;
  font-weight: bold;
  justify-content: center;
  color: teal;
  margin-bottom: .5em;
}
.login__btn {
  margin-right: 2rem;
}
.success__message {
  margin-top: 3rem;
  font-size: 0.8rem;
}

</style>

