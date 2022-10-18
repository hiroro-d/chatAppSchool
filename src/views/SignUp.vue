<template>
  <div id="login">
    <v-card class="login__container">
      <v-card-title class="login__ttl">Signin</v-card-title>
      <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
      <v-btn
        to="/login"
        color="light-blue"
        text
      >ログイン画面はこちら</v-btn>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="User Name"
          required
        ></v-text-field>

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
          class="login__btn mr-4"
          color="success"
          :disabled="isValid"
          @click="submit"
        >
          Sign Up
        </v-btn>
        <v-btn
          color="error"
        >
          Reset
        </v-btn>

      </v-form>
    </v-card>
  </div>
</template>

<script>
import { auth } from '@/firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default {
  data() {
    return {
      valid: true,
      name: '',
      nameRules: [
        v => !!v || '名前を入力してください',
        v => (v && v.length <= 10) || '名前は10文字以内で入力してください',
      ],
      email: '',
      emailRules: [
        v => !!v || 'メールアドレスを入力してください',
        v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が不正です',
      ],
      password: '',
      errorMessage: '',
    }
  },
  computed: {
    isValid() {
      return !this.valid;
    }
  },
  methods: {
    submit() {
      const authApp = auth;
      createUserWithEmailAndPassword(authApp, this.email, this.password) //authに登録データ送信
        .then((response) => { //成功したら
          // Signed in
          const user = response.user;
          console.log(`success signup`, user)
          updateProfile(auth.currentUser, {
            displayName: this.name
          }).then(() => {
            console.log('success update', user)
          }).catch((error) => {
            console.log('error update', error)
          });
          this.$refs.form.reset();
          localStorage.message = 'アカウント登録に成功しました';
          this.$router.push('/login')
        })
        .catch((error) => { //失敗したら
          console.log(`error signup`, error)
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // ..
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
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.login__container {
  width: 375px;
  padding: 30px;
}
.login__ttl {
  justify-content: center;
  font-size: 2.2rem;
  font-weight: bold;
  color: teal;
  margin-bottom: 0.5em;
}
.error__message {
  margin-top: 3rem;
  font-size: 0.8rem;
}
</style>
