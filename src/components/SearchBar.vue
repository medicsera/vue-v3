<template>
  <div class="search-task-form">
    <div class="search-task">
      <input
        class="search-task-input"
        type="text"
        placeholder="Search task"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <img class="search-task-lupe" src="../assets/lupe.svg"/>
    </div>
    <button class="open-modal-btn" @click="showModal = true">+</button>
  </div>
</template>

<script>
export default {
  props: ['modelValue'],
};
</script>



<style scoped lang="scss">
.search-task-form{
    @include flex-center;
    width: 500px;
    height: 40px;
    max-width: 560px;
    padding-top: 20px;
    
    .search-task{
        display: flex;
        align-items: center;
        margin: 0 20px 0 0;
        border: 4px;
        border-radius: 10px;
        background: $color-white;

        .search-task-input{
        max-width: 360px;
        font-size: $stat-font-size;
        margin-left: 10px;
        border: 0;
        height: 90%;
        outline: none;
        }
        
        .search-task-lupe{
            width: 30px;
            height: 100%;
            border: 0;
            background: $color-white;
            margin-right: 10px;
        }
    }

    .open-modal-btn{
        font-size: 1.5em;
        height: 100%;
        width: 40px;
        @include border;
        background: $color-light-purple;
    }
}

@include respond-to(mobile){
    .search-task-form{
        height: 30px;
        width: 220px;
        
        .search-task{
            width: 100%;
            margin: 0 5px;
        }  
        
        .search-task-input{
            width: 150px;
            font-size: 1.1em;
        }

        .open-modal-btn{
            height: 30px;
            width: 30px;
            font-size: 1.3em;
        }
    }
}
</style>
