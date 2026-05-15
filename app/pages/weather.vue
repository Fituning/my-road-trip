<template>
  <div class="min-h-[100dvh] flex flex-col relative overflow-hidden text-white bg-gradient-to-b from-[#2d4a22] to-[#0f1f12]">

    <div class="relative w-full h-[50vh] flex-none">

      <img
          src="/bg-landscape.jpg"
          alt="Paysage"
          class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          :class="isNight ? 'opacity-40' : 'opacity-100'"
      />

      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#2d4a22] to-transparent"></div>
      <div v-if="isNight" class="absolute inset-0 bg-slate-900/60 transition-colors duration-1000"></div>

      <div class="absolute inset-0 pointer-events-none z-10">
        <WeatherBackground :displayWeather="displayWeather" :isNight="isNight" />
      </div>

      <NuxtLink to="/" class="absolute top-12 left-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg active:scale-95 cursor-pointer">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </NuxtLink>

      <div v-if="weather" class="relative z-20 flex flex-col items-center justify-center h-full pt-6 animate-slide-down pointer-events-none">
        <h1 class="text-sm font-black tracking-[0.2em] drop-shadow-md uppercase">{{ weather.current.name }}</h1>
        <div class="text-[7rem] font-headline font-black leading-none drop-shadow-xl tracking-tighter my-1">
          {{ Math.round(weather.current.main.temp) }}°
        </div>
        <p class="text-xl font-bold capitalize tracking-wide drop-shadow-md">
          {{ weather.current.weather[0].description }}
        </p>
        <div class="flex gap-4 mt-2 text-sm font-bold drop-shadow-md">
          <span>H: {{ Math.round(weather.current.main.temp_max) }}°</span>
          <span>L: {{ Math.round(weather.current.main.temp_min) }}°</span>
        </div>
      </div>
    </div>

    <main v-if="weather" class="flex-1 -mt-8 bg-white/10 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-white/20 shadow-[0_-20px_50px_rgba(0,0,0,0.25)] p-6 pt-8 relative z-30 flex flex-col gap-8 overflow-y-auto animate-slide-up text-white">

      <div class="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full"></div>

      <section class="mt-2">
        <h2 class="text-[11px] font-black text-white/80 uppercase tracking-[0.2em] mb-4 drop-shadow-sm">Prévisions (3h)</h2>
        <div class="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
          <div
              v-for="(item, index) in weather.forecast"
              :key="index"
              class="snap-start flex-none w-[4.5rem] py-4 flex flex-col items-center gap-3 rounded-[1.5rem] border transition-transform hover:scale-105"
              :class="index === 0 ? 'bg-white/40 border-white/60 shadow-lg' : 'bg-black/20 backdrop-blur-md border-white/10 shadow-sm'"
          >
            <span class="text-xs font-bold opacity-90">{{ index === 0 ? 'Mnt' : formatHour(item.dt) }}</span>
            <span class="text-2xl drop-shadow-sm">{{ getWeatherEmoji(item.weather[0].icon) }}</span>
            <span class="text-base font-black">{{ Math.round(item.main.temp) }}°</span>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-black/20 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex flex-col gap-1 shadow-inner">
          <span class="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            Vent
          </span>
          <span class="text-2xl font-black drop-shadow-sm">{{ Math.round(weather.current.wind.speed * 3.6) }} <span class="text-sm font-medium opacity-70">km/h</span></span>
        </div>
        <div class="bg-black/20 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex flex-col gap-1 shadow-inner">
          <span class="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7H3"></path></svg>
            Humidité
          </span>
          <span class="text-2xl font-black drop-shadow-sm">{{ weather.current.main.humidity }}<span class="text-sm font-medium opacity-70">%</span></span>
        </div>
      </div>

    </main>

    <div v-else class="flex-1 flex flex-col items-center justify-center space-y-4 text-white z-20">
      <div class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p class="font-bold tracking-widest uppercase text-xs animate-pulse opacity-70">Scan du ciel...</p>
    </div>

    <button @click="cycleDebugWeather" class="fixed bottom-6 right-6 z-50 bg-black/40 backdrop-blur-md p-3 rounded-full text-[10px] font-bold uppercase text-white shadow-lg opacity-50 hover:opacity-100 transition-opacity">
      Test: {{ debugWeatherState || 'Auto' }}
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const weather = ref<any>(null);

// Debug System
const debugStates = [null, 'Clear', 'Clouds', 'Rain'];
const debugIndex = ref(0);
const debugWeatherState = computed(() => debugStates[debugIndex.value]);
const cycleDebugWeather = () => { debugIndex.value = (debugIndex.value + 1) % debugStates.length; };

const formatHour = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit' }) + 'h';
};

const isNight = computed(() => {
  if (!weather.value) return false;
  const current = weather.value.current.dt;
  return current < weather.value.current.sys.sunrise || current > weather.value.current.sys.sunset;
});

const displayWeather = computed(() => {
  if (debugWeatherState.value) return debugWeatherState.value;
  if (!weather.value || weather.value.error) return null;
  const main = weather.value.current.weather[0].main;
  return ['Rain', 'Drizzle', 'Thunderstorm'].includes(main) ? 'Rain' : main;
});

const getWeatherEmoji = (iconCode: string) => {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '✨', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '☁️';
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (p) => {
      weather.value = await $fetch('/api/weather', { params: { lat: p.coords.latitude, lon: p.coords.longitude } });
    });
  }
});
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.animate-slide-down { animation: slideDown 0.8s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>