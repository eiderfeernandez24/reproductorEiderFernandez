import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
    
    const searchText = ref('');
    const loadSearch = true;

    return { searchText, loadSearch }
})
