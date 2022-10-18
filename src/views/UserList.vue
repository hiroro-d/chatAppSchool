<template>
  <div class="users">
    <SideBar />
    <v-container>
        <h1>User Lists</h1>
        <v-row>
          <v-col
            v-for="n in 24"
            :key="n"
            cols="4"
          >
            <router-link :to="{path: 'chat', query: {user_id: n} }">
              <v-avatar class="mb-4" color="grey lighten-2" size="120"></v-avatar>
            </router-link>
            <!-- <v-card height="200"></v-card> -->
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import SideBar from '@/components/layouts/SideBar';
export default {
  components: {
    SideBar,
  }
}
</script>
