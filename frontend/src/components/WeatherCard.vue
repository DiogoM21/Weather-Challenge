<script setup>
import { ref, onMounted } from 'vue';
import { mdiReload } from '@mdi/js';
import CardBox from './CardBox.vue';
import BaseIcon from './BaseIcon.vue';
import { useWeatherStore } from '@/stores/weather';

const weatherStore = useWeatherStore();
const temp = ref(0);

async function getCurrentWeather() {
    temp.value = await weatherStore.getCurrentWeather('2267094');
}

onMounted(async () => {
    await getCurrentWeather();
});
</script>

<template>
    <CardBox>
        <div class="flex items-center w-full justify-center gap-4">
            <span class="text-4xl">Leiria</span>
            <span class="text-4xl font-bold">{{ temp }}°C</span>
            <BaseIcon
                :path="mdiReload"
                :size="24"
                class="mt-1 hover:text-sky-700 text-gray-800 dark:text-white dark:hover:text-sky-500 cursor-pointer transition-colors"
                @click="getCurrentWeather"
            />
        </div>
    </CardBox>
</template>
