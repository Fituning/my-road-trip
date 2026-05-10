<template>
  <div class="min-h-full p-6 flex flex-col items-center pt-12 pb-24 relative overflow-hidden">
    <div class="absolute top-[5%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-tertiary-container rounded-[100%] mix-blend-multiply filter blur-[100px] opacity-40 -z-10"></div>

    <header class="w-full max-w-md text-center mb-10 relative z-10">
      <div class="inline-block px-4 py-1.5 bg-quaternary text-on-quaternary rounded-full text-sm font-bold tracking-wide mb-4 shadow-sm transform -rotate-2">
        Roadtrip 2026 🚐
      </div>
      <h1 class="font-headline text-4xl font-extrabold text-on-surface leading-tight">
        Ciao Carlo <br> <span class="text-secondary">& Caro !</span>
      </h1>
    </header>

    <section class="w-full max-w-md bg-surface-bright rounded-[40px_30px_50px_20px/30px_50px_20px_40px] shadow-surf border border-surface-dim/30 p-8 mb-8 relative z-10">

      <div v-if="tripStatus === 'upcoming'">
        <h2 class="text-center text-on-surface-variant font-medium mb-6">Départ dans...</h2>

        <div class="flex justify-between items-center gap-2">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-primary text-on-primary rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center text-2xl font-headline font-bold shadow-sm mb-1">
              {{ countdown.days }}
            </div>
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jours</span>
          </div>
          <span class="text-2xl font-bold text-primary/50 mb-5">:</span>

          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-[50%_50%_40%_60%/60%_40%_50%_50%] flex items-center justify-center text-2xl font-headline font-bold shadow-sm mb-1">
              {{ countdown.hours }}
            </div>
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hrs</span>
          </div>
          <span class="text-2xl font-bold text-primary/50 mb-5">:</span>

          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-[60%_40%_50%_50%/50%_60%_40%_50%] flex items-center justify-center text-2xl font-headline font-bold shadow-sm mb-1">
              {{ countdown.minutes }}
            </div>
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Min</span>
          </div>
        </div>
      </div>

      <div v-else-if="tripStatus === 'ongoing'" class="text-center">
        <h2 class="text-secondary font-headline text-2xl font-bold mb-2">On y est ! 🎉</h2>
        <p class="text-on-surface mb-4">Profitez à fond des Dolomites et du Tyrol.</p>
        <div class="w-full bg-surface-container-high rounded-full h-4 overflow-hidden shadow-inner border border-outline-variant/30">
          <div class="bg-gradient-to-r from-primary via-secondary to-tertiary h-full rounded-full transition-all duration-1000" :style="{ width: tripProgress + '%' }"></div>
        </div>
        <p class="text-xs font-bold text-on-surface-variant mt-2 tracking-wide uppercase">
          {{ tripProgress }}% du voyage complété
        </p>
      </div>

      <div v-else class="text-center">
        <div class="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
          📸
        </div>
        <h2 class="text-tertiary font-headline text-2xl font-bold mb-2">Voyage Terminé</h2>
        <p class="text-on-surface-variant mb-4">Il est temps de se remémorer ces 13 jours incroyables.</p>
        <button class="px-6 py-3 bg-tertiary text-on-tertiary font-bold rounded-full shadow-sm hover:scale-105 hover:bg-tertiary-container hover:text-on-tertiary-container transition-all">
          Voir notre Wrapped
        </button>
      </div>
    </section>

    <nav class="w-full max-w-md grid grid-cols-2 gap-4 relative z-10">
      <NuxtLink to="/roadmap" class="bg-primary-container text-on-primary-container p-5 rounded-[2rem_1rem_2rem_1rem] shadow-sm hover:-translate-y-1 transition-transform flex flex-col items-center justify-center gap-2 group">
        <svg class="w-8 h-8 group-hover:scale-110 transition-transform text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        <span class="font-bold tracking-wide">Roadmap</span>
      </NuxtLink>

      <NuxtLink to="/packing" class="bg-surface-bright text-on-surface border-2 border-secondary/30 p-5 rounded-[1rem_2rem_1rem_2rem] shadow-sm hover:-translate-y-1 hover:border-secondary transition-all flex flex-col items-center justify-center gap-2 group">
        <svg class="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
        <span class="font-bold tracking-wide">Checklist</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
/**
 * Component: Dashboard (Home)
 * Description: Displays a dynamic countdown based on the trip dates and quick navigation links.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Define the exact trip timeline (May 19th to May 31st 2026)
const TRIP_START_DATE = new Date('2026-05-19T08:00:00').getTime();
const TRIP_END_DATE = new Date('2026-05-31T20:00:00').getTime();

type TripStatus = 'upcoming' | 'ongoing' | 'finished';

// Reactive state
const currentTime = ref<number>(new Date().getTime());
let timerInterval: ReturnType<typeof setInterval>;

/**
 * Computes the current status of the roadtrip.
 */
const tripStatus = computed<TripStatus>(() => {
  if (currentTime.value < TRIP_START_DATE) return 'upcoming';
  if (currentTime.value >= TRIP_START_DATE && currentTime.value <= TRIP_END_DATE) return 'ongoing';
  return 'finished';
});

/**
 * Computes the remaining time before departure.
 */
const countdown = computed(() => {
  const distance = TRIP_START_DATE - currentTime.value;

  if (distance < 0) return { days: 0, hours: 0, minutes: 0 };

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
  };
});

/**
 * Computes the percentage of the trip completed (for the progress bar).
 */
const tripProgress = computed<string>(() => {
  if (tripStatus.value === 'upcoming') return '0';
  if (tripStatus.value === 'finished') return '100';

  const totalDuration = TRIP_END_DATE - TRIP_START_DATE;
  const elapsed = currentTime.value - TRIP_START_DATE;
  const percentage = (elapsed / totalDuration) * 100;

  return percentage.toFixed(1);
});

// Update the current time every minute to refresh the countdown
onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = new Date().getTime();
  }, 60000); // 60 seconds
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>