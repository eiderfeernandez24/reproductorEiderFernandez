<template>
    <div class="player-container">
        <div class="content-container">
            <div class="lateral-container">
                <div class="search-box-container">
                    <input v-model="searchDataStore.searchText" placeholder="Buscar" type="text" name="searchQuery" class="search-box">
                    <i class="bi bi-search"></i>
                </div>
                
                <!-- Lista de últimas canciones reproducidas -->
                <div class="recently-played-container">
                    <h3>Últimas canciones</h3>
                    <ul>
                        <li v-for="(song, index) in recentlyPlayed" :key="index" @click="playRecentSong(song)">
                            {{ song.name }}
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="data-container">
                <RouterView />
            </div>
        </div>

        <div class="reproductor-container">
            <audio ref="reproductor" id="Reproductor" controls>
                <source :src="soundDataStore.soundUrl" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio> 

            <div class="sound-data-container">
                <label>{{ soundDataStore.soundName }}</label>
            </div>

            <div class="control-box">
                <div class="buttons-container">
                    <i class="bi bi-skip-backward"></i>
                    <i :class="currentButtonIcon" @click="toggleReproduction"></i>
                    <i class="bi bi-skip-forward"></i>
                </div>
                <div class="range-container">
                    <input :disabled="soundDataStore.soundUrl == ''" @input="changeAudioTime" type="range" :value="songCurrentTime" min="0" :max="songFullTime">
                </div>
                <div class="range-time-container">
                    <label class="start">{{ currentTime }}</label>
                    <label class="end">{{ endTime }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

let currentButtonIcon = ref("bi bi-play-circle");
const reproductor = ref(null);

let currentTime = ref("0:00");
let endTime = ref("0:00");
let songCurrentTime = ref(0);
let songFullTime = ref(0);
let recentlyPlayed = ref([]);

watch(soundDataStore, () => {
    reproductor.value.load();
    reproductor.value.play();
    currentButtonIcon.value = "bi bi-pause-circle";

    // Guardar en la lista de últimas canciones reproducidas
    if (soundDataStore.soundUrl) {
        addToRecentlyPlayed({ name: soundDataStore.soundName, url: soundDataStore.soundUrl });
    }
});

onMounted(() => {
    reproductor.value.addEventListener('loadedmetadata', () => {
        let duration = Math.floor(reproductor.value.duration);
        songFullTime.value = duration;
        endTime.value = "0:" + duration;
    });

    reproductor.value.addEventListener("timeupdate", () => {
        let duration = Math.floor(reproductor.value.currentTime);
        currentTime.value = "0:" + duration;
        songCurrentTime.value = duration;
    });
});

const changeAudioTime = (e) => {
    if (e.target.value == Math.floor(reproductor.value.currentTime)) return;
    reproductor.value.currentTime = e.target.value;
    currentTime.value = "0:" + Math.floor(reproductor.value.currentTime);
};

const toggleReproduction = () => {
    if (reproductor.value.paused) {
        currentButtonIcon.value = "bi bi-pause-circle";
        reproductor.value.play();
    } else {
        currentButtonIcon.value = "bi bi-play-circle";
        reproductor.value.pause();
    }
};

const addToRecentlyPlayed = (song) => {
    // Evitar duplicados consecutivos
    if (recentlyPlayed.value.length === 0 || recentlyPlayed.value[0].url !== song.url) {
        recentlyPlayed.value.unshift(song);
        if (recentlyPlayed.value.length > 5) {
            recentlyPlayed.value.pop();
        }
    }
};

const playRecentSong = (song) => {
    soundDataStore.soundName = song.name;
    soundDataStore.soundUrl = song.url;
};
</script>

<style>
.recently-played-container {
    margin-top: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #000000, #080706);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.recently-played-container h3 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #fff;
    text-align: center;
}
.recently-played-container ul {
    list-style: none;
    padding: 0;
}
.recently-played-container li {
    cursor: pointer;
    padding: 10px;
    margin: 5px 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    color: #fff;
    text-align: center;
    transition: background 0.3s ease;
}
.recently-played-container li:hover {
    background: rgba(255, 255, 255, 0.4);
}
</style>