import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    users: [],
  }),

  actions: {
    register(email, password) {
      if (!/\S+@\S+\.S+/.text(email)) return { error: "Некорректный email" };
      if (this.users.some((u) => u.email === email))
        return { error: "Такой email уже зарегистрирован" };

      this.users.push({ email, password });
      this.currentUser = { email };

      return { success: true };
    },

    login(email, password) {
      const currEmail = this.users.find((u) => u.email === email);

      if (!currEmail) {
        return { error: "Такой пользователь не зарегистрирован" };
      } else {
        const user = this.users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return { error: "Неверный пароль" };

        this.currentUser = { email };
        return { success: true };
      }
    },

    logout() {
      this.currentUser = null;
    },
  },
  persist: true,
});
