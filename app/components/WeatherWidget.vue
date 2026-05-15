<template>
  <div v-if="weather && weather.current" class="flex flex-col items-center justify-center p-3 bg-surface-bright/80 backdrop-blur-md rounded-2xl shadow-sm border border-outline-variant/30">
    <span class="text-3xl drop-shadow-sm mb-1">
      {{ getWeatherEmoji(weather.current.weather[0].icon) }}
    </span>
    <span class="font-headline font-black text-xl text-on-surface leading-none">
      {{ Math.round(weather.current.main.temp) }}°
    </span>
  </div>

  <div v-else class="flex flex-col items-center justify-center p-3 bg-surface-bright/50 rounded-2xl border border-outline-variant/30 opacity-50">
    <div v-if="city" class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-1"></div>
    <span v-else class="text-lg">🌍</span>
    <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
      {{ city ? '...' : 'No City' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// On rend la prop "city" optionnelle (avec le "?") pour éviter le warning Vue
const props = defineProps<{
  city?: string;
}>();

const weather = ref<any>(null);

const getWeatherEmoji = (iconCode: string) => {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '✨', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '☁️';
};

onMounted(async () => {
  // On ne lance l'appel API que si la ville existe vraiment
  if (props.city) {
    try {
      weather.value = await $fetch('/api/weather', { params: { city: props.city } });
    } catch (e) {
      console.error("Erreur météo pour", props.city);
    }
  }
});
</script>