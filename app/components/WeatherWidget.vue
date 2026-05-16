<template>
  <div class="w-16 h-20 flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg rounded-[1.5rem] border border-white/30 shadow-lg transition-all duration-500">

    <template v-if="weather && weather.current">
      <span class="text-3xl drop-shadow-md mb-1 animate-slide-in">
        {{ getWeatherEmoji(weather.current.weather[0].icon) }}
      </span>
      <span class="font-headline font-black text-lg text-white leading-none tracking-tighter">
        {{ Math.round(weather.current.main.temp) }}°
      </span>
    </template>

    <template v-else>
      <div v-if="city" class="flex flex-col items-center">
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

/**
 * WeatherWidget Component
 * Displays a minimal weather summary with a glassmorphism effect.
 */

const props = defineProps<{
  city?: string;
}>();

const weather = ref<any>(null);

/**
 * Maps OpenWeather API icons to high-quality emojis
 */
const getWeatherEmoji = (iconCode: string): string => {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '✨',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '☁️';
};

onMounted(async () => {
  if (props.city) {
    try {
      // Securely fetch weather from our internal API
      weather.value = await $fetch('/api/weather', { params: { city: props.city } });
    } catch (e) {
      console.error(`[WeatherWidget] Failed to fetch data for ${props.city}`, e);
    }
  }
});
</script>

<style scoped>
/* Smooth entry for the emoji */
.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>