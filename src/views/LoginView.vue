<template>
  <div class="page">
    <div class="login__container">
      <h1>Вход</h1>
      <form class="login-form" @submit.prevent="login">
        <input
          class="login-form-input"
          v-model="email"
          placeholder="Email"
          required
        />
        <input
          class="login-form-input"
          v-model="password"
          placeholder="Password"
          required
        />
        <button class="login-form-btn" type="submit">Войти</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
      <div class="to-register">
        <p>Нет аккаунта?</p>
        <router-link class="link" to="/register"> Зарегистрироваться</router-link>
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
.login__container {
  @include border;
  display: flex;
  flex-direction: column;
  background: $color-dark-purple;
  width: 500px;
  height: 600px;
  margin-top: 8%;
  padding: 24px;

  h1 {
    display: flex;
    justify-content: center;
    color: $color-white;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    margin: 20px;

    &-input {
      @include border;
      height: 40px;
      margin: 10px 0px;
      padding-left: 10px;
      font-size: 1.2em;
    }

    &-btn {
      @include border;
      height: 50px;
      margin: 30px 0px;
      background: $color-light-purple;
      font-size: 1.3em;
    }

    .error {
    display: flex;
    justify-content: center;
      color: $color-red;
      font-size: 1.4em;
    }
  }

  .to-register{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    font-size: 1.3em;
    color: $color-white;      

    .link{
        color: $color-light-purple;
        text-decoration: none;
        margin-left: 10px;
    }
  }
  
}
</style>
