<template>
  <div>
    <SideBar />
    <v-container
      class="py-8 px-6"
      fluid
    >
      <h1>チャットボード（User ID：）</h1>
      <v-row>
        <v-col
          v-for="card in cards"
          :key="card"
          cols="12"
        >
          <v-card>
            <v-subheader>{{ card }}</v-subheader>
            <v-list two-line>
              <template v-for="(data, index) in messages">
                <v-list-item
                  :key="index"
                >
                  <v-list-item-avatar color="grey darken-1">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ data.message }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index !== 6"
                  :key="`divider-${index}`"
                  inset
                ></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <br><br><br><br>
      <v-textarea
        append-outer-icon="mdi-comment"
        class="mx-2"
        label="メッセージ入力"
        rows="1"
        auto-grow
        v-model="body"
      ></v-textarea>
      <v-btn
          class="mr-4"
          type="submit"
          :disabled="invalid"
          @click="submit"
        >
          submit
        </v-btn>
        <v-btn
          @click="clear"
        >
          clear
        </v-btn>
    </v-container>
  </div>

</template>


<script>
import SideBar from '@/components/layouts/SideBar';
import { db } from '@/firebase/firebase.js';
import {collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';

export default {
  components: {
    SideBar,
  },
  data() {
    return {
      userId: 0, //ユーザーID
      postId: 0,
      cards: ['Today'],
      body: '',
      messages: [
        {message: 'メッセージ01'},
        {message: 'メッセージ02'},
        {message: 'メッセージ03'},
        {message: 'メッセージ03'},
      ],
      // invalid: true,
    }
  },
  computed: {
    invalid() {
      if(this.body === false) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.userId = this.$route.query.user_id;
  },
  mounted() {
    //firestoreからデータを受け取るためのクエリ
    //昇順(asc),降順(desc)
    const q =  query(collection(db, 'chats'), orderBy('createAt', 'asc'));
    onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added') { //データベースに追加されたら
          this.messages.unshift(change.doc.data()) //変化したデータを取得
          console.log('added', change.doc.data())
        }
      })
    })
  },
  methods: {
    submit() {
      addDoc(collection(db, 'chats'), {
        createAt: serverTimestamp(),
        userId: this.userId,
        postId: this.postId,
        message: this.body,
      })
      .then(doc => {
        console.log(`success addDoc! (${doc.id})`)
        this.postId++;
        this.body = '';
      })
      .catch(error => {
        console.log(`error addDoc! (${error}`)
      })
    },
    clear() {
      this.body = '';
    }
  }

}
</script>
