import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSoundDataStore = defineStore('soundDataStore', () => {
    
    const soundName = ref('')
    //https://cdn.freesound.org/previews/6/6465_2518-hq.mp3
    const soundUrl = ref('')
    const soundImg = ref('');

    const resetSound = () => {
        soundName.value = '';
        soundUrl.value = '';
        soundUrl.value = '';
    }

    return { soundUrl, soundName, soundImg, resetSound }
})
