<template>
  <div class="min-h-[100dvh] p-6 flex flex-col items-center pt-38 pb-24 relative overflow-hidden">

    <div class="absolute top-[5%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-tertiary-container rounded-[100%] mix-blend-multiply filter blur-[100px] opacity-40 -z-20"></div>

    <div v-if="displayWeather" class="absolute inset-0 pointer-events-none -z-10 overflow-hidden">

      <div v-if="displayWeather === 'Clear'">
        <div class="absolute -top-6 -left-[30%] w-[130%] animate-drift-medium opacity-60 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 1000 200" :class="displayWeather === 'Rain' ? 'text-blue-200/80' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,100 Q80,50 150,100 T300,90 T450,120 T650,80 T850,110 T1000,90 L1000,0 L0,0 Z" />
          </svg>
        </div>
        <div class="absolute -top-6 -left-[10%] w-[140%] animate-drift-fast opacity-60 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 1000 200" :class="displayWeather === 'Rain' ? 'text-slate-300' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,120 Q100,60 200,120 T400,110 T600,140 T800,90 T1000,120 L1000,0 L0,0 Z" />
          </svg>
        </div>

        <div class="absolute top-4 right-2 flex items-center justify-center">
          <div class="absolute w-32 h-32 bg-[#e39e1c]/30 rounded-full blur-3xl animate-pulse"></div>
          <svg class="w-32 h-32 text-[#e39e1c] drop-shadow-[0_0_20px_rgba(227,158,28,0.8)] animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="currentColor" />
          </svg>
        </div>

        <div class="absolute top-20 left-[20%] animate-fly-1">
          <svg class="w-5 h-5 text-inverse-surface/60 animate-flap flap-slow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" />
          </svg>
        </div>
        <div class="absolute top-12 left-[40%] animate-fly-2">
          <svg class="w-4 h-4 text-inverse-surface/50 animate-flap flap-fast" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" />
          </svg>
        </div>
        <div class="absolute top-28 left-[65%] animate-fly-3">
          <svg class="w-6 h-6 text-inverse-surface/40 animate-flap flap-medium" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" />
          </svg>
        </div>
      </div>

      <div v-if="displayWeather === 'Clouds' || displayWeather === 'Rain'" class="absolute top-0 left-0 w-full h-64">
        <div class="absolute -top-6 -left-[30%] w-[130%] animate-drift-medium drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          <svg viewBox="0 0 1000 200" :class="displayWeather === 'Rain' ? 'text-blue-100' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,100 Q80,50 150,100 T300,90 T450,120 T650,80 T850,110 T1000,90 L1000,0 L0,0 Z" />
          </svg>
        </div>
        <div class="absolute -top-4 -left-[10%] w-[140%] animate-drift-slow drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <svg viewBox="0 0 1000 200" :class="displayWeather === 'Rain' ? 'text-blue-200' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,80 Q50,40 100,80 T200,80 T300,60 T450,100 T600,70 T750,90 T900,60 T1000,80 L1000,0 L0,0 Z" />
          </svg>
        </div>
        <div class="absolute -top-6 -left-[10%] w-[140%] animate-drift-fast drop-shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
          <svg viewBox="0 0 1000 200" :class="displayWeather === 'Rain' ? 'text-slate-300' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,120 Q100,60 200,120 T400,110 T600,140 T800,90 T1000,120 L1000,0 L0,0 Z" />
          </svg>
        </div>
      </div>

      <div v-if="displayWeather === 'Rain'" class="absolute inset-0">
        <div class="absolute top-32 left-[15%] w-1.5 h-8 bg-blue-400/40 rounded-full animate-rain"></div>
        <div class="absolute top-24 left-[45%] w-1.5 h-6 bg-blue-300/40 rounded-full animate-rain delay-100"></div>
        <div class="absolute top-40 left-[75%] w-1.5 h-10 bg-blue-400/30 rounded-full animate-rain delay-300"></div>
      </div>
    </div>

    <NuxtLink
        v-if="localWeather"
        to="/weather"
        class="absolute top-8 right-8 z-30 flex flex-col items-end text-right group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
    >
      <span class="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">
        {{ localWeather.name }}
      </span>
      <span class="font-headline text-5xl font-black text-primary leading-none tracking-tighter drop-shadow-sm">
        {{ Math.round(localWeather.main.temp) }}°
      </span>
      <div class="flex items-center gap-1.5 mt-1">
        <span class="text-xs font-bold text-on-surface-variant/80 capitalize">
        {{ localWeather.weather[0].description }}
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
        <span class="font-bold">Roadmap</span>
      </NuxtLink>
      <NuxtLink to="/packing" class="bg-surface-bright text-on-surface border border-surface-dim/30 p-6 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col items-center gap-2">
        <span class="font-bold">Checklist</span>
      </NuxtLink>
      <NuxtLink to="/memories" class="col-span-2 bg-[#cda87c] text-on-surface-variant p-5 rounded-3xl shadow-md hover:-translate-y-1 transition-transform flex items-center justify-center gap-3">
        <span class="text-xl">📌</span>
        <span class="font-bold uppercase tracking-wider text-sm">Mur de Souvenirs</span>
      </NuxtLink>
    </nav>

<!--    <button @click="cycleDebugWeather" class="fixed bottom-6 right-6 z-50 bg-black/10 backdrop-blur-md p-3 rounded-full text-[10px] font-bold uppercase opacity-40 hover:opacity-100">-->
<!--      Test: {{ debugWeatherState || 'Auto' }}-->
<!--    </button>-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const TRIP_START_DATE = new Date('2026-05-19T08:00:00').getTime();
const TRIP_END_DATE = new Date('2026-05-31T20:00:00').getTime();

const currentTime = ref<number>(new Date().getTime());
const localWeather = ref<any>(null);

// Debug
const debugStates = [null, 'Clear', 'Clouds', 'Rain'];
const debugIndex = ref(0);
const debugWeatherState = computed(() => debugStates[debugIndex.value]);
const cycleDebugWeather = () => { debugIndex.value = (debugIndex.value + 1) % debugStates.length; };

const displayWeather = computed(() => {
  if (debugWeatherState.value) return debugWeatherState.value;
  if (!localWeather.value || localWeather.value.error) return null;
  const main = localWeather.value.weather[0].main;
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(main)) return 'Rain';
  return main;
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

<style scoped>
/* ☁️ Dérive des Nuages */
@keyframes drift {
  from { transform: translateX(-5%); }
  to { transform: translateX(5%); }
}
.animate-drift-slow { animation: drift 30s ease-in-out infinite alternate; }
.animate-drift-medium { animation: drift 20s ease-in-out infinite alternate-reverse; }
.animate-drift-fast { animation: drift 10s ease-in-out infinite alternate; }

/* 🐦 Vol et Battement des Oiseaux */
@keyframes fly-1 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(15px, -8px); }
  66% { transform: translate(-10px, 5px); }
}
@keyframes fly-2 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-12px, 6px); }
  66% { transform: translate(18px, -4px); }
}
@keyframes fly-3 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(10px, 10px); }
  66% { transform: translate(-15px, -8px); }
}

.animate-fly-1 { animation: fly-1 18s ease-in-out infinite; }
.animate-fly-2 { animation: fly-2 24s ease-in-out infinite; }
.animate-fly-3 { animation: fly-3 22s ease-in-out infinite; }

@keyframes flap {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.4); }
}
.animate-flap {
  animation: flap 0.8s ease-in-out infinite;
  transform-origin: center;
}
.flap-fast { animation-duration: 1.4s; }
.flap-medium { animation-duration: 1.6s; }
.flap-slow { animation-duration: 1.8s; }

/* 🌧️ Pluie */
@keyframes rain-fall {
  0% { transform: translateY(-20px); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translateY(400px); opacity: 0; }
}
.animate-rain { animation: rain-fall 0.8s linear infinite; }
.delay-100 { animation-delay: 0.1s; }
.delay-300 { animation-delay: 0.3s; }
</style>