<template>
  <div class="min-h-[100dvh] bg-surface flex flex-col p-6 pt-12 pb-12 relative overflow-hidden">

    <div class="absolute top-[5%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-secondary-container rounded-[100%] mix-blend-multiply filter blur-[100px] opacity-30 -z-10"></div>

    <header class="flex items-center justify-between mb-10 relative z-10">
      <NuxtLink to="/" class="w-12 h-12 bg-surface-bright rounded-full flex items-center justify-center shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform">
        <svg class="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
      </NuxtLink>
      <h1 class="font-headline text-xl font-black uppercase tracking-widest text-on-surface-variant">Conditions Live</h1>
      <div class="w-12"></div>
    </header>

    <main v-if="weather" class="flex-1 space-y-6 relative z-10">

      <section class="bg-surface-bright/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-surf border border-white/40 text-center">
        <p class="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">{{ weather.name }}</p>
        <div class="relative inline-block">
          <span class="font-headline text-8xl font-black text-on-surface tracking-tighter">
            {{ Math.round(weather.main.temp) }}°
          </span>
          <span class="absolute -top-2 -right-6 text-4xl">
             {{ weather.main.temp > 20 ? '☀️' : '☁️' }}
          </span>
        </div>
        <p class="text-lg font-medium text-on-surface-variant capitalize mt-2 italic">
          "{{ weather.weather[0].description }}"
        </p>
      </section>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-primary-container/40 p-5 rounded-[2rem] border border-primary/10">
          <span class="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-widest block mb-1">💨 Vent</span>
          <span class="text-xl font-black text-on-primary-container">{{ Math.round(weather.wind.speed * 3.6) }} km/h</span>
        </div>
        <div class="bg-tertiary-container/30 p-5 rounded-[2rem] border border-tertiary/10">
          <span class="text-[10px] font-bold text-on-tertiary-fixed-variant uppercase tracking-widest block mb-1">💧 Humidité</span>
          <span class="text-xl font-black text-on-tertiary-container">{{ weather.main.humidity }}%</span>
        </div>
      </div>

      <section class="bg-inverse-surface text-inverse-on-surface p-6 rounded-[2.5rem] shadow-lg">
        <h3 class="font-headline font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2 text-primary-container">
          ✨ Captain's Briefing
        </h3>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="text-xl">{{ weather.wind.speed * 3.6 < 20 ? '🚁' : '⚠️' }}</span>
            <p class="text-sm font-medium leading-snug">
              {{ weather.wind.speed * 3.6 < 20 ? 'Conditions idéales pour une session drone.' : 'Vent fort : évite de sortir le drone maintenant.' }}
            </p>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-xl">{{ weather.main.temp < 12 ? '🔥' : '🚐' }}</span>
            <p class="text-sm font-medium leading-snug">
              {{ weather.main.temp < 12 ? 'Il va faire frais : pense à vérifier le niveau de diesel pour le chauffage.' : 'Température douce : la nuit dans le van sera parfaite.' }}
            </p>
          </li>
        </ul>
      </section>

    </main>

    <div v-else class="flex-1 flex flex-col items-center justify-center space-y-4">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="font-bold text-on-surface-variant animate-pulse">Récupération des satellites...</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/**
 * Detailed weather page for the roadtrip.
 * Uses the custom server API to fetch data based on current geolocation.
 */

const weather = ref<any>(null);

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Fetching from our secure server route
        weather.value = await $fetch('/api/weather', {
          params: { lat: latitude, lon: longitude }
        });
      } catch (err) {
        console.error("Failed to fetch weather details", err);
      }
    });
  }
});
</script>

<style scoped>
/* Smooth fade-in for the main sections */
main > * {
  animation: slide-up 0.6s ease-out forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>