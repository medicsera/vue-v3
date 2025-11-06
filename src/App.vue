<template>
  <div class="page">
    <div class="page__container">
      <SearchBar v-model="searchQuery" @open-modal="showModal = true" />
      <TaskList
        :tasks="filteredTasks, sortedTasks"
        @delete-task="deleteTask"
        @toggle-completed="toggleCompleted"
      />
      <TaskForm v-if="showModal" @close="showModal = false" @add-task="addTask" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import SearchBar from './components/SearchBar.vue';

export default {
  components: { TaskList, TaskForm, SearchBar },
  setup() {
    const tasks = ref([]);
    const showModal = ref(false);
    const searchQuery = ref('');

    const filteredTasks = computed(() => {
      if (!searchQuery.value) return tasks.value;
      return tasks.value.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const sortedTasks = computed(() => {
      tasks.value.slice().sort((a,b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      })
    })

    function addTask(task) {
      tasks.value.push(task);
      showModal.value = false;
      saveTasks();
    }

    function deleteTask(id) {
      if (confirm("Вы точно хотите удалить эту задачу?")){
        tasks.value = tasks.value.filter((t) => t.id !== id);
        saveTasks();
      }
      
    }

    function toggleCompleted(id) {
      const task = tasks.value.find((t) => t.id === id);
      if (task) task.completed = !task.completed;
      saveTasks();
    }

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    }

    function loadTasks() {
      const saved = localStorage.getItem('tasks');
      tasks.value = saved ? JSON.parse(saved) : [];
    }

    loadTasks();

    return {
      tasks,
      showModal,
      searchQuery,
      filteredTasks,
      sortedTasks,
      addTask,
      deleteTask,
      toggleCompleted,
    };
  },
};
</script>

<style scoped lang="scss">

</style>
