import Vue from 'vue'
import VueRouter from 'vue-router'
import UserList from '../views/UserList.vue'
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'UserList',
    component: UserList,
    meta: { requiresAuth: true } //オース認証がtrueになった人だけ遷移
  },
  {
    path: '/chat',
    name: 'ChatBoad',
    component: () => import(/* webpackChunkName: "about" */ '../views/ChatBoad.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "about" */ '../views/LogIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {  //ログインしている状態でページを離れた時に、自動でログインするかどうか見たいな処理
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    const authApp = auth;
    onAuthStateChanged(authApp, (user) => {
      if (!user) { //ユーザー情報入ってなかったら
        next({ //ログインに飛ばす
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next() //そのまま通過していいよ
      }
    });
  } else {
    next()
  }
})







export default router
