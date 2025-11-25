<template>
  <div class="page">
    <div class="page__container">
      <SearchBar v-model="searchQuery" @open-modal="showModal = true" @logout="handleLogout" />
      <TaskList
        :tasks="sortedTasks"
        @toggle-completed="toggleCompleted"
        @delete-task="deleteTask"
        @edit-task="editTask"
      />
      <TaskForm
        v-if="showModal"
        @close="showModal = false"
        @add-task="addTask"
      />
    </div>
    <ThemeToggle />
    <AboutToggle />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import TaskList from "../components/TaskList.vue";
import TaskForm from "../components/TaskForm.vue";
import SearchBar from "../components/SearchBar.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import { useTodoStore } from "../stores/useTodoStore";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/useUserStore";
import AboutToggle from "../components/AboutToggle.vue";

export default {
  components: { TaskList, TaskForm, SearchBar, ThemeToggle, AboutToggle },
  setup() {
    const showModal = ref(false);
    const searchQuery = ref("");
    const todoStore = useTodoStore();
    const userStore = useUserStore();
    const router = useRouter();

    function addTask(task){
      const taskWithUser = {
        ...task,
        email: userStore.currentUser.email
      }
      todoStore.addTask(taskWithUser)
      showModal.value = false;
    }

    function editTask({id,task}){
      todoStore.editTask({id,task});
    }

    function deleteTask(id){
      if (confirm("Вы точно хотите удалить эту задачу?")){
        todoStore.deleteTask(id)
      }
    }

    function toggleCompleted(id){
      todoStore.toggleCompleted(id)
    }

    const sortedTasks = computed(() => {
      if (!userStore.currentUser) return []
      
      let filtered = todoStore.tasks.filter(task => task.email === userStore.currentUser.email)

      if (searchQuery.value) {
        filtered = filtered.filter((t) =>
          t.text.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return filtered.slice().sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });

    function handleLogout() {
      userStore.logout();
      (useUserStore)
      router.push('/login')
    }
   

    return {
      showModal,
      searchQuery,
      sortedTasks,
      addTask,
      deleteTask,
      toggleCompleted,
      editTask,
      handleLogout,
    };
  },
};
</script>

<style scoped lang="scss"></style>
