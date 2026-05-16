<template>
  <div class="min-h-[100dvh] bg-quaternary-container flex flex-col pt-8 pb-6 relative overflow-hidden">

    <svg class="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 200">
      <defs>
        <marker id="tri-dir" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto">
          <path d="M 0 1 L 10 5 L 0 9 z" class="text-on-surface-variant/20" fill="currentColor" />
        </marker>
      </defs>
      <path class="text-tertiary-container" fill="currentColor" d="M -10 150 Q 10 120 30 155 T 60 165 T 90 140 T 120 150 L 120 -10 L -10 -10 Z" />
      <path class="text-secondary-container" fill="currentColor" d="M -10 110 Q 10 140 35 110 T 65 95 T 95 115 T 120 100 L 120 -10 L -10 -10 Z" />
      <path class="text-primary-container" fill="currentColor" d="M -10 60 Q 15 30 45 55 T 75 70 T 105 45 T 130 60 L 120 -10 L -10 -10 Z" />
      <path class="text-on-surface-variant/10" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" marker-mid="url(#tri-dir)" d="M -10 150 Q 10 120 30 155 T 60 165 T 90 140 T 120 150" />
      <path class="text-on-surface-variant/10" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" marker-mid="url(#tri-dir)" d="M -10 110 Q 10 140 35 110 T 65 95 T 95 115 T 120 100" />
      <path class="text-on-surface-variant/10" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" marker-mid="url(#tri-dir)" d="M -10 60 Q 15 30 45 55 T 75 70 T 105 45 T 130 60" />
    </svg>

    <header class="px-6 flex items-center justify-between mb-8 relative z-10">
      <NuxtLink to="/" class="w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/50 hover:scale-105 transition-transform text-on-primary-container">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
      </NuxtLink>
      <h1 class="font-headline text-2xl font-black text-on-primary-container">Itinéraire</h1>
      <div class="w-12 h-12"></div>
    </header>

    <div class="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[12.5vw] gap-[25vw] pb-10 items-center relative z-10">

      <div v-if="status === 'pending' && (!tripDays || tripDays.length === 0)" class="w-full text-center font-bold text-on-surface-variant animate-pulse">
        Calcul de la route... 🚐
      </div>

      <TripDayCard
          v-else
          v-for="(day, index) in tripDays"
          :key="day.id"
          :day="day"
          :index="index"
          @refresh="refreshData"
      />
      <div class="flex-none w-[1px] h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();

const { data: tripDays, status, refresh: refreshData } = await useAsyncData('tripsDays', async () => {
  try {
    const rawDays = await $pb.collection('trips_days').getFullList({ sort: 'day_number' });
    return structuredClone(rawDays);
  } catch (err) {
    console.error("Failed to load itinerary", err);
    return [];
  }
});
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>