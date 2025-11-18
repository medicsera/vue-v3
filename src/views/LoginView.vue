<template>
  <div class="page">
    <div class="login-reg__container">
      <h1>Вход</h1>
      <form class="form" @submit.prevent="login">
        <input
          class="form-input"
          v-model="email"
          placeholder="Email"
          required
        />
        <input
          class="form-input"
          v-model="password"
          placeholder="Password"
          required
        />
        <button class="form-btn" type="submit">Войти</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
      <div class="toggle-auth">
        <p>Нет аккаунта?</p>
        <router-link class="link" to="/register">
          Зарегистрироваться</router-link
        >
      </div>
    </div>
    <ThemeToggle />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useRouter } from "vue-router";
import ThemeToggle from "../components/ThemeToggle.vue";

const email = ref("");
const password = ref("");
const error = ref("");

const userStore = useUserStore();
const router = useRouter();

async function login() {
  error.value = "";
  const res = userStore.login(email.value, password.value);

  if (res.error) {
    error.value = res.error;
  } else {
    await router.push("/todo");
  }
}
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: center;
  color: $color-white;
}
</style>
