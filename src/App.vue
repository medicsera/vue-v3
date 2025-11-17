<template>
  <div class="page">
    <div class="page__container">
      <SearchBar v-model="searchQuery" @open-modal="showModal = true" />
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
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import TaskList from "./components/TaskList.vue";
import TaskForm from "./components/TaskForm.vue";
import SearchBar from "./components/SearchBar.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import { useTodoStore } from "./stores/useTodoStore";

export default {
  components: { TaskList, TaskForm, SearchBar, ThemeToggle },
  setup() {
    const showModal = ref(false);
    const searchQuery = ref("");
    const todoStore = useTodoStore();

    function addTask(task){
      todoStore.addTask(task)
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
      let filtered = todoStore.tasks;
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
   

    return {
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
