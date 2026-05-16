<template>
  <div class="min-h-[100dvh] p-6 flex flex-col items-center pt-38 pb-24 relative overflow-hidden">

    <div class="absolute top-[5%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-tertiary-container rounded-[100%] mix-blend-multiply filter blur-[100px] opacity-40 -z-20"></div>

    <WeatherBackground :displayWeather="displayWeather" />

    <NuxtLink
        v-if="localWeather && localWeather.current"
        to="/weather"
        class="absolute top-8 right-8 z-30 flex flex-col items-end text-right group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
    >
      <span class="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">
        {{ localWeather.current.name }}
      </span>
      <span class="font-headline text-5xl font-black text-primary leading-none tracking-tighter drop-shadow-sm">
        {{ Math.round(localWeather.current.main.temp) }}°
      </span>
      <div class="flex items-center gap-1.5 mt-1">
        <span class="text-xs font-bold text-on-surface-variant/80 capitalize">
        {{ localWeather.current.weather[0].description }}
        </span>
        <svg class="w-3 h-3 text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </NuxtLink>

    <header class="w-full max-w-md text-center mb-12 relative z-10">
      <div class="inline-block px-4 py-1.5 bg-quaternary text-on-quaternary rounded-full text-sm font-bold tracking-wide mb-4 shadow-sm transform -rotate-2">
        Roadtrip 2026 🚐
      </div>
      <h1 class="font-headline text-4xl font-extrabold text-on-surface leading-tight">
        Ciao Carlo <br> <span class="text-secondary">& Caro !</span>
      </h1>
    </header>

    <section class="w-full max-w-md bg-surface-bright/90 backdrop-blur-xl rounded-[3rem] shadow-surf border border-surface-dim/30 p-8 mb-8 relative z-10">
      <div v-if="tripStatus === 'upcoming'">
        <h2 class="text-center text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-6">Départ dans...</h2>
        <div class="flex justify-between items-center px-2">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center text-2xl font-headline font-black shadow-sm mb-1">{{ countdown.days }}</div>
            <span class="text-[10px] font-bold text-on-surface-variant uppercase">Jours</span>
          </div>
          <span class="text-xl font-black text-primary/30 mb-5">:</span>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center text-2xl font-headline font-black shadow-sm mb-1">{{ countdown.hours }}</div>
            <span class="text-[10px] font-bold text-on-surface-variant uppercase">Hrs</span>
          </div>
          <span class="text-xl font-black text-primary/30 mb-5">:</span>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center text-2xl font-headline font-black shadow-sm mb-1">{{ countdown.minutes }}</div>
            <span class="text-[10px] font-bold text-on-surface-variant uppercase">Min</span>
          </div>
        </div>
      </div>
    </section>

    <nav class="w-full max-w-md grid grid-cols-2 gap-4 relative z-10">
      <NuxtLink to="/roadmap" class="bg-primary-container text-on-primary-container p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col items-center gap-2">
        <span class="font-bold">Roadmap 🗺️</span>
      </NuxtLink>
      <NuxtLink to="/packing" class="bg-surface-bright text-on-surface border border-surface-dim/30 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col items-center gap-2">
        <span class="font-bold">Checklist 📋</span>
      </NuxtLink>

      <NuxtLink to="/map" class="col-span-2 bg-quaternary text-white p-5 rounded-3xl shadow-md hover:-translate-y-1 transition-transform flex items-center justify-center gap-3">
        <span class="text-xl">🚐</span>
        <span class="font-bold uppercase tracking-wider text-sm">Suivre le Van (Live Map)</span>
      </NuxtLink>

      <NuxtLink to="/memories" class="col-span-2 bg-[#cda87c] text-on-surface-variant p-5 rounded-3xl shadow-md hover:-translate-y-1 transition-transform flex items-center justify-center gap-3">
        <span class="text-xl">📌</span>
        <span class="font-bold uppercase tracking-wider text-sm">Mur de Souvenirs</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const TRIP_START_DATE = new Date('2026-05-19T08:00:00').getTime();
const TRIP_END_DATE = new Date('2026-05-31T20:00:00').getTime();

const currentTime = ref<number>(new Date().getTime());
const localWeather = ref<any>(null);

const displayWeather = computed(() => {
  if (!localWeather.value || localWeather.value.error || !localWeather.value.current) return null;
  const main = localWeather.value.current.weather[0].main;
  return ['Rain', 'Drizzle', 'Thunderstorm'].includes(main) ? 'Rain' : main;
});

const tripStatus = computed(() => {
  if (currentTime.value < TRIP_START_DATE) return 'upcoming';
  if (currentTime.value <= TRIP_END_DATE) return 'ongoing';
  return 'finished';
});

const countdown = computed(() => {
  const diff = TRIP_START_DATE - currentTime.value;
  if (diff < 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000)
  };
});

onMounted(() => {
  setInterval(() => { currentTime.value = new Date().getTime(); }, 60000);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (p) => {
      localWeather.value = await $fetch('/api/weather', { params: { lat: p.coords.latitude, lon: p.coords.longitude } });
    });
  }
});
</script>


