import { defineStore } from "pinia";

export const useTodoStore = defineStore('todo', {

    state: () => ({
        tasks:[]
    }),

    actions: {
        addTask(task){
            this.tasks.push(task);
        },
        editTask({id,text}){
            const t = this.tasks.find(e => e.id === id);
            if (t) t.text = text;
        },
        deleteTask(id){
            this.tasks = this.tasks.filter(t => t.id !== id)
        },
        toggleCompleted(id){
            const t = this.tasks.find(e => e.id === id);
            if (t) t.completed = !t.completed
        }
    },
    persist: true

})