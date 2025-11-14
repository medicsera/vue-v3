<template>
  <div class="task-item">
    <div class="task-item-left">
      <span v-if="!isEditing" class="task-text" :class="{ completed: task.completed }" @dblclick="startEdit">
        {{ task.text }}
      </span>
      <input v-else class="task-edit-input" v-model="editText" @blur="finishEdit" @keyup.enter="finishEdit"
        @keyup.esc="cancelEdit" autofocus />
    </div>
    <div class="task-item-right">
      <input type="checkbox" class="task-checkbox" :checked="task.completed"
        @change="$emit('toggle-completed', task.id)" />
      <button class="del-btn" @click="$emit('delete-task', task.id)">&#128465;</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ task: Object });
const emit = defineEmits(['edit-task', 'toggle-completed', 'delete-task']);

const isEditing = ref(false);
const editText = ref('');

function startEdit() {
  isEditing.value = true;
  editText.value = props.task.text;
}

function finishEdit() {
  if (editText.value.trim() && editText.value !== props.task.text) {
    emit('edit-task', { id: props.task.id, text: editText.value.trim() });
  }
  isEditing.value = false;
  editText.value = '';
}

function cancelEdit() {
  isEditing.value = false;
  editText.value = '';
}
</script>

<style scoped lang="scss">
.task {

  &-item {
    @include flex-center;
    @include border;
    color: var(--color-font);
    align-items: center;
    width: 460px;
    height: 76px;
    background: var(--color-item);
    justify-content: space-between;
    margin-top: 20px;
    transition: opacity 0.5s, height 0.5s, margin 0.5s, padding 0.5s;

    &-right {
      @include flex-center;
      align-items: center;
      margin-right: 30px;
      opacity: 0;

      .del-btn {
        font-size: 0.9em;
        width: 28px;
        height: 28px;
        background: var(--color-btn-bg);
        color: var(--color-btn-img);
        border-radius: 5px;
        border: 0;
      }

    }

    &:hover .task-item-right {
      transition: all 0.3s ease;
      opacity: 1;
    }

    &-left {
      margin-left: 20px;
    }

    &.removing {
      opacity: 0;
      height: 0;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  }

  &-checkbox {
    width: 28px;
    height: 28px;
    margin: 0 10px;
    accent-color: var(--color-btn-bg);
  }


  &-text {
    max-width: 200px;
    word-break: break-all;
    transition: color 0.4s, text-decoration 0.4s;

    &.completed {
      color: $color-green;
      text-decoration: line-through;
    }
  }
}

.task-edit-input {
  width: 90%;
  font-size: 1em;
  border: 1px solid var(--color-btn-bg);
  padding: 4px 8px;
  border-radius: 5px;
}

@include respond-to(mobile) {
  .task {

    &-item {
      width: 100%;
      height: 60px;


      &-right {
        margin-right: 5px;
        opacity: 1;

        .del-btn {
          width: 20px;
          height: 20px;
          font-size: 0.7em;
        }
      }
    }

    &-checkbox {
      width: 20px;
      height: 20px;
    }
    }
}
</style>
