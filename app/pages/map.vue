<template>
  <div class="min-h-[100dvh] bg-gradient-to-tr from-[#6a1b7e] via-[#da57f5] to-[#7a5200]/40 flex flex-col relative overflow-hidden text-white">

    <div class="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[#40e0d0]/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-5%] left-[-10%] w-96 h-96 bg-[#a2d149]/20 rounded-full blur-3xl pointer-events-none"></div>

    <header class="absolute top-12 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
      <NuxtLink to="/" class="w-14 h-14 bg-[#40e0d0] text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_8px_0_#005a53] hover:translate-y-1 hover:shadow-[0_4px_0_#005a53] active:translate-y-2 active:shadow-none transition-all cursor-pointer transform -rotate-3 pointer-events-auto">
        <svg class="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </NuxtLink>
      <div class="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-black tracking-widest uppercase shadow-lg transform rotate-2 pointer-events-auto">
        {{ currentStepIdx === -1 ? 'Trajet Complet 🌍' : 'Live Tracker 🚐' }}
      </div>
    </header>

    <section class="relative w-full h-[52vh] shadow-2xl overflow-hidden z-20 bg-slate-900 border-b border-white/20">
      <ClientOnly>
        <div id="real-map" class="w-full h-full"></div>
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center bg-slate-900">
            <div class="w-8 h-8 border-4 border-[#a2d149] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <main class="flex-1 bg-white/10 backdrop-blur-xl p-6 relative z-20 flex flex-col justify-between gap-4">

      <div class="flex justify-between items-center border-b border-white/10 pb-3">
        <div v-if="currentStepIdx === -1">
          <span class="text-[9px] font-black text-[#b5f5ee] uppercase tracking-widest">Roadtrip Prêt</span>
          <h2 class="font-headline text-2xl font-black">Prêt au départ ?</h2>
        </div>
        <div v-else>
          <span class="text-[9px] font-black text-[#b5f5ee] uppercase tracking-widest">Étape {{ currentStepIdx + 1 }}</span>
          <h2 class="font-headline text-2xl font-black truncate max-w-[200px]">{{ currentStep?.arrival_city }}</h2>
        </div>

        <div class="text-right" v-if="currentStepIdx !== -1">
          <span class="text-[9px] font-black text-[#e2f7b8] uppercase tracking-widest">Temps de route</span>
          <p class="font-headline font-bold text-sm text-[#e2f7b8]">{{ currentStep?.travel_time || 'N/A' }}</p>
        </div>
      </div>

      <div v-if="currentStepIdx !== -1 && parsedLinks.length > 0" class="flex flex-col gap-1.5">
        <span class="text-[8px] font-black uppercase tracking-widest text-white/60">Logistique & Liens</span>
        <div class="flex flex-wrap gap-2 max-h-16 overflow-y-auto hide-scrollbar">
          <a
              v-for="(link, lIdx) in parsedLinks"
              :key="lIdx"
              :href="link.url"
              target="_blank"
              class="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[11px] font-bold flex items-center gap-1.5 no-underline text-white transition-all shadow-sm active:scale-95"
          >
            <span>🔗</span> {{ link.name }}
          </a>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-[8px] font-black uppercase tracking-wider mb-1 text-white/50">
          <span>Progression</span>
          <span>{{ currentStepIdx === -1 ? 'Vue globale' : `Jour ${currentStepIdx + 1} / ${tripDays.length}` }}</span>
        </div>
        <div class="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
              class="h-full bg-gradient-to-r from-[#40e0d0] to-[#a2d149] rounded-full transition-all duration-500 shadow-md"
              :style="{ width: currentStepIdx === -1 ? '0%' : `${((currentStepIdx + 1) / tripDays.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button @click="prevStep" :disabled="currentStepIdx === -1" class="py-3 bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-white">
          Précédent
        </button>
        <button @click="nextStep" :disabled="currentStepIdx === tripDays.length - 1" class="py-3 bg-white text-slate-900 shadow-lg hover:bg-slate-100 disabled:opacity-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer">
          {{ currentStepIdx === -1 ? 'Démarrer 🚐' : 'Suivant 🚐' }}
        </button>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import 'leaflet/dist/leaflet.css';

const { $pb } = useNuxtApp();
const tripDays = ref<any[]>([]);

// -1 represents the global track summary mode before advancing
const currentStepIdx = ref(-1);

let map: any = null;
let L: any = null;
let marker: any = null;
let routeLine: any = null;

const currentStep = computed(() => {
  if (currentStepIdx.value === -1) return null;
  return tripDays.value[currentStepIdx.value] || null;
});

const parsedLinks = computed(() => {
  if (!currentStep.value || !currentStep.value.useful_links) return [];
  const raw = currentStep.value.useful_links;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
});

const initMap = async () => {
  L = (await import('leaflet')).default;

  // Set default initial location to safety coordinates before data mapping opens up
  map = L.map('real-map', { zoomControl: false, attributionControl: false }).setView([46.8, 11.5], 6);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

  await drawRoute();
  focusCurrentStep();
};

const drawRoute = async () => {
  if (!map || tripDays.value.length === 0) return;

  const points = tripDays.value.map(day => ({
    lat: day.lat || 45.4642,
    lng: day.lng || 9.1900
  }));

  const coordinatesQuery = points.map(p => `${p.lng},${p.lat}`).join(';');

  try {
    const data: any = await $fetch(`https://router.project-osrm.org/route/v1/driving/${coordinatesQuery}?geometries=geojson`);

    if (data.routes && data.routes.length > 0) {
      const realRoadCoords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);

      routeLine = L.polyline(realRoadCoords, { color: '#da57f5', weight: 4.5, dashArray: '6, 12', lineCap: 'round' }).addTo(map);
    }
  } catch (error) {
    console.error("OSRM tracking failed, running straight lines fallback layout:", error);
    routeLine = L.polyline(points.map(p => [p.lat, p.lng]), { color: '#da57f5', weight: 3, dashArray: '5, 5' }).addTo(map);
  }

  // Inject checkpoint node pins
  points.forEach(coord => {
    L.circleMarker([coord.lat, coord.lng], { radius: 5, fillColor: '#a2d149', color: '#ffffff', weight: 1.5, fillOpacity: 1 }).addTo(map);
  });

  const vanIcon = L.divIcon({
    html: '<div style="font-size: 24px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.6));">🇲🇨 🚐</div>',
    className: '',
    iconSize: [30, 30]
  });

  marker = L.marker([points[0].lat, points[0].lng], { icon: vanIcon }).addTo(map);
};

/**
 * Handles map centering and zooming based on the current indexing layout status
 */
const focusCurrentStep = () => {
  if (!map || tripDays.value.length === 0 || !marker) return;

  if (currentStepIdx.value === -1) {
    // Overview mode: Center the map to wrap the complete itinerary bounds seamlessly
    if (routeLine) {
      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    }
    // Set the tracking marker back to the initial day starting base coordinate point
    const firstDay = tripDays.value[0];
    marker.setLatLng([firstDay.lat || 45.4642, firstDay.lng || 9.1900]);
  } else {
    // Tracking mode: Focus tightly on the selected daily stop coordinates
    const day = currentStep.value;
    const targetCoord: [number, number] = [day.lat || 45.4642, day.lng || 9.1900];

    map.flyTo(targetCoord, 11, { duration: 1.2 });
    marker.setLatLng(targetCoord);
  }
};

const nextStep = () => { if (currentStepIdx.value < tripDays.value.length - 1) { currentStepIdx.value++; focusCurrentStep(); } };
const prevStep = () => { if (currentStepIdx.value >= 0) { currentStepIdx.value--; focusCurrentStep(); } };

onMounted(async () => {
  try {
    const rawDays = await $pb.collection('trips_days').getFullList({ sort: 'day_number' });
    tripDays.value = structuredClone(rawDays);
    setTimeout(() => { initMap(); }, 150);
  } catch (err) { console.error(err); }
});
</script>

<style>
#real-map { width: 100%; height: 100%; }
.leaflet-container { background: #0f172a; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>