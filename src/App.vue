<template>
  <div class="page">
    <div class="page__container">
      <SearchBar v-model="searchQuery" @open-modal="showModal = true" />
      <TaskList :tasks="sortedTasks" @toggle-completed="toggleCompleted" @delete-task="deleteTask"
        @edit-task="editTask" />
      <TaskForm v-if="showModal" @close="showModal = false" @add-task="addTask" />
    </div>
    <ThemeToggle />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import TaskList from "./components/TaskList.vue";
import TaskForm from "./components/TaskForm.vue";
import SearchBar from "./components/SearchBar.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

export default {
  components: { TaskList, TaskForm, SearchBar, ThemeToggle },
  setup() {
    const tasks = ref([]);
    const showModal = ref(false);
    const searchQuery = ref("");

    function loadTasks() {
      const saved = localStorage.getItem("tasks");
      tasks.value = saved ? JSON.parse(saved) : [];
    }

    watch(
      tasks,
      (newTasks) => {
        localStorage.setItem("tasks", JSON.stringify(newTasks));
      },
      { deep: true }
    );

    const sortedTasks = computed(() => {
      let filtered = tasks.value;
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

    function addTask(task) {
      tasks.value.push(task);
      showModal.value = false;
    }

    function deleteTask(id) {
      if (confirm("Вы точно хотите удалить эту задачу?")) {
        tasks.value = tasks.value.filter((t) => t.id !== id);
      }
    }

    function toggleCompleted(id) {
      const task = tasks.value.find((t) => t.id === id);
      if (task) task.completed = !task.completed;
    }

    function editTask({ id, text }) {
      const t = tasks.value.find((e) => e.id === id);
      if (t) t.text = text;
    }

    loadTasks();

    return {
      tasks,
      showModal,
      searchQuery,
      sortedTasks,
      addTask,
      deleteTask,
      toggleCompleted,
      editTask,
    };
  },
};
</script>

<style scoped lang="scss"></style>
