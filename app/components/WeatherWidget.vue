<template>
  <div class="w-16 h-20 flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg rounded-[1.5rem] border border-white/30 shadow-lg transition-all duration-500">

    <template v-if="weather && weather.trend">
      <span class="text-3xl drop-shadow-md mb-1 animate-slide-in">
        {{ getWeatherEmoji(weather.trend.icon) }}
      </span>
      <span class="font-headline font-black text-lg text-white leading-none tracking-tighter">
        {{ Math.round(weather.trend.temp) }}°
      </span>
    </template>

    <template v-else>
      <div v-if="city || (lat && lng)" class="flex flex-col items-center">
        <div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span class="text-[8px] font-black text-white/60 uppercase tracking-widest mt-2">Loading</span>
      </div>
      <div v-else class="flex flex-col items-center opacity-40">
        <span class="text-2xl">🌍</span>
        <span class="text-[8px] font-black text-white uppercase tracking-widest mt-1">N/A</span>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  city?: string;
  lat?: number;
  lng?: number;
  date?: string;
}>();

const weather = ref<any>(null);

const getWeatherEmoji = (iconCode: string): string => {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '✨', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '⛅'; // Petit fallback sécurisé
};

onMounted(async () => {
  try {
    const queryParams: Record<string, any> = {};

    if (props.lat !== undefined && props.lng !== undefined && props.lat !== null && props.lng !== null) {
      queryParams.lat = props.lat;
      queryParams.lon = props.lng;
    } else if (props.city) {
      queryParams.city = props.city;
    }

    if (props.date) {
      queryParams.date = props.date;
    }

    if (Object.keys(queryParams).length > 0) {
      weather.value = await $fetch('/api/weather', { params: queryParams });
    }
  } catch (e) {
    console.error(`[WeatherWidget] Failed to fetch data`, e);
  }
});
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}
@keyframes slideIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>