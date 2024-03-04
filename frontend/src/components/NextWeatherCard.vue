<script setup>
const props = defineProps({
    nextWeather: {
        type: Array,
        default: () => [],
    },
    isRefreshing: {
        type: Boolean,
        default: false,
    },
    selectedUnit: {
        type: String,
        default: 'metric',
    },
    lang: {
        type: String,
        default: 'en',
    },
});

function getTempColor(temp) {
    if (props.isRefreshing) {
        return 'text-black dark:text-white';
    }
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

function getWindSymbol() {
    switch (props.selectedUnit) {
        case 'imperial':
            return 'mph';
        case 'metric':
        case 'default':
            return 'm/s';
        default:
            return 'm/s';
    }
}

function getTitle(values, description) {
    switch (props.lang) {
        case 'pt':
            return `${description ?? 'Descrição'}\nParece: ${values.feels_like ?? 0}${getUnitSymbol()}\nVento: ${values.wind ?? 0}${getWindSymbol()} ${values.deg ?? 0}º\nHumidade: ${values.humidity ?? 0}%`;
        default:
            return `${description ?? 'Description'}\nFeels like: ${values.feels_like ?? 0}${getUnitSymbol()}\nWind: ${values.wind ?? 0}${getWindSymbol()} ${values.deg ?? 0}º\nHumidity: ${values.humidity ?? 0}%`;
    }
}
</script>

<template>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-5" :class="{ 'animate-pulse': isRefreshing }">
        <div v-for="weather in nextWeather" :key="weather.info.dt" class="animate-fade-in">
            <div
                :title="getTitle(weather.values, weather.info.description)"
                class="flex flex-col items-center justify-center bg-slate-200/40 dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 hover:scale-105"
            >
                <div>
                    <img
                        :src="
                            weather?.info.icon
                                ? `http://openweathermap.org/img/wn/${weather?.info.icon}@4x.png`
                                : require('@/assets/weather.png')
                        "
                        :alt="weather?.info.description"
                        class="w-12 h-12 md:w-18 md:h-18 -mt-2"
                    />
                </div>
                <span class="text-sm md:text-md font-bold" :class="getTempColor(weather?.values.temp)"
                    >{{ weather?.values.temp ?? 0 }}{{ getUnitSymbol() }}</span
                >
                <span class="text-sm md:text-md font-medium text-gray-800 dark:text-gray-400">{{
                    weather?.info.date_time
                }}</span>
            </div>
        </div>
    </div>
    <slot />
</template>
