<template>
  <div v-if="weather" class="flex items-center gap-3 bg-surface-bright/80 backdrop-blur-md p-3 rounded-2xl border border-surface-dim/30 shadow-sm transition-all hover:scale-105">
    <div class="text-3xl">
      {{ getWeatherEmoji(weather.weather[0].main) }}
    </div>
    <div class="flex flex-col">
      <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter truncate w-20">
        {{ city }}
      </span>
      <span class="font-headline font-black text-lg text-primary leading-none">
        {{ Math.round(weather.main.temp) }}°
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Component: WeatherWidget
 * Fetches and displays weather for a specific city.
 */
const props = defineProps<{ city: string }>();

const { data: weather } = await useAsyncData(`weather-${props.city}`, () =>
    $fetch('/api/weather', { params: { city: props.city } })
);

/**
 * Maps OpenWeather states to cute emojis.
 * You could also use animated SVGs here.
 */
const getWeatherEmoji = (state: string) => {
  const map: Record<string, string> = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️'
  };
  return map[state] || '✨';
};
</script>