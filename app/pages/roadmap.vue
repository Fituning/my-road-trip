<template>
  <div class="min-h-[100dvh] bg-surface flex flex-col pt-8 pb-6 relative overflow-hidden">

    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">

      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-[100px]"></div>
      <div class="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/20 rounded-full filter blur-[90px]"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-amber-500/15 rounded-full filter blur-[120px]"></div>

      <svg class="w-full h-full absolute inset-0 text-on-surface-variant/30" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1.5 2.5" stroke-linecap="round">
        <path d="M -10 50 C 20 85 40 85 50 50 C 60 15 80 15 110 50" />
      </svg>

      <div class="absolute top-[75%] left-[25%] w-5 h-5 bg-primary/30 rounded-full flex items-center justify-center animate-pulse">
        <div class="w-2 h-2 bg-primary rounded-full"></div>
      </div>
      <div class="absolute top-[50%] left-[50%] w-5 h-5 bg-secondary/30 rounded-full flex items-center justify-center animate-pulse delay-300">
        <div class="w-2 h-2 bg-secondary rounded-full"></div>
      </div>
      <div class="absolute top-[25%] left-[75%] w-5 h-5 bg-tertiary/30 rounded-full flex items-center justify-center animate-pulse delay-700">
        <div class="w-2 h-2 bg-tertiary rounded-full"></div>
      </div>
    </div>

    <header class="px-6 flex items-center justify-between mb-8 relative z-10">
      <NuxtLink to="/" class="w-12 h-12 bg-surface-bright rounded-full flex items-center justify-center shadow-sm border border-outline-variant/30 hover:-translate-y-1 active:scale-95 transition-transform text-on-surface">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
      </NuxtLink>
      <h1 class="font-headline text-2xl font-bold text-on-surface">Notre Itinéraire</h1>
      <div class="w-12 h-12"></div>
    </header>

    <div class="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 gap-6 pb-8 items-center relative z-10">

      <div v-if="status === 'pending'" class="w-full text-center text-on-surface-variant font-bold mt-10">
        Chargement... 🚐
      </div>

      <div v-else-if="!tripDays || tripDays.length === 0" class="w-full text-center text-on-surface-variant font-bold mt-10">
        Aucun jour trouvé. Ajoute-les depuis PocketBase ! 🗺️
      </div>

      <TripDayCard
          v-else
          v-for="(day, index) in tripDays"
          :key="day.id || index"
          :day="day"
          @refresh="refreshData"
      />

      <div class="flex-none w-6 h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Page: Roadmap
 * Description: Fetches the trip itinerary and orchestrates the TripDayCard components.
 */

// 1. Retrieve the global PocketBase client instance
const { $pb } = useNuxtApp();

// 2. Fetch trip days asynchronously
const { data: tripDays, status, refresh: refreshData } = await useAsyncData('tripsDays', async () => {
  try {
    const rawDays = await $pb.collection('trips_days').getFullList({
      sort: 'day_number',
    });
    return structuredClone(rawDays);
  } catch (err) {
    console.error("Failed to fetch trips_days collection:", err);
    return [];
  }
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>