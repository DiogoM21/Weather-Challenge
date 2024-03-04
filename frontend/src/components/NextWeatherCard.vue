<script setup>
const props = defineProps({
    nextWeather: {
        type: Object,
        default: null,
    },
    isRefreshing: {
        type: Boolean,
        default: false,
    },
    selectedUnit: {
        type: String,
        default: 'metric',
    },
});

function getTempColor(temp) {
    let cold = 'text-blue-700 dark:text-blue-500';
    let hot = 'text-red-700 dark:text-red-500';
    let warm = 'text-yellow-700 dark:text-yellow-500';
    switch (props.selectedUnit) {
        case 'imperial':
            return temp > 80 ? hot : temp < 60 ? cold : warm;
        case 'metric':
            return temp > 27 ? hot : temp < 15 ? cold : warm;
        case 'default':
            return temp > 300 ? hot : temp < 288 ? cold : warm;
        default:
            return 'text-black dark:text-white';
    }
}

function getUnitSymbol() {
    switch (props.selectedUnit) {
        case 'metric':
            return '°C';
        case 'default':
            return 'K';
        case 'imperial':
            return '°F';
        default:
            return '°C';
    }
}
</script>

<template>
    <div class="scrollable grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        <div v-for="weather in nextWeather" :key="weather?.info.dt">
            <div class="flex flex-col items-center justify-center">
                <div>
                    <img
                        :src="
                            weather?.info.icon
                                ? `http://openweathermap.org/img/wn/${weather?.info.icon}@4x.png`
                                : require('@/assets/weather.png')
                        "
                        :alt="weather?.info.description"
                        :title="weather?.info.description"
                        class="w-12 h-12 md:w-18 md:h-18"
                    />
                </div>
                <span class="text-sm md:text-md font-bold" :class="getTempColor(weather?.values.temp)"
                    >{{ weather?.values.temp ?? 0 }}{{ getUnitSymbol() }}</span
                >
                <span class="text-sm md:text-md text-gray-800 dark:text-gray-400">{{ weather?.info.date_time }}</span>
            </div>
        </div>
    </div>
</template>
