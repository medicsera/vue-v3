<template>
  <div class="task">
    <TaskItem v-for="task in tasks" :key="task.id" :task="task" @toggle-completed="$emit('toggle-completed', task.id)"
      @delete-task="$emit('delete-task', task.id)" @edit-task="$emit('edit-task', $event)" />
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue';

defineProps({
  tasks: Array
});
defineEmits(['toggle-completed', 'delete-task', 'edit-task']);
</script>

<style scoped lang="scss">
.task {
  padding: 30px 20px;
  font-size: $stat-font-size;
  display: grid;
  width: 100%;
}

@include respond-to(mobile) {
  .task {
    width: 220px;
    font-size: 1.1em;
    padding: 20px 0px;
  }
}
</style>