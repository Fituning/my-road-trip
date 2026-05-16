<template>
  <div class="h-[100dvh] w-full bg-[#030303] text-white flex flex-col relative overflow-hidden font-body select-none">

    <div class="absolute top-12 left-4 right-4 flex gap-1.5 z-[60]">
      <div v-for="(slide, index) in totalSlides" :key="index" class="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
        <div
            class="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            :style="{ width: index === currentSlideIdx ? `${progress}%` : (index < currentSlideIdx ? '100%' : '0%') }"
        ></div>
      </div>
    </div>

    <button @click="closeWrapped" class="absolute top-16 right-4 z-[60] w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <div class="absolute inset-0 z-50 flex">
      <div class="w-1/3 h-full cursor-pointer" @click="prevSlide"></div>
      <div class="w-2/3 h-full cursor-pointer" @click="nextSlideManual"></div>
    </div>

    <div class="flex-1 relative flex items-center justify-center p-6 text-center z-40 pointer-events-none">

      <div v-if="currentSlideIdx === 0" class="animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
        <div class="relative w-64 h-64 mb-16">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-quaternary rounded-full animate-spin-slow blur-[60px] opacity-70"></div>
          <div class="w-full h-full bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center text-8xl relative z-10">🚐</div>
        </div>
        <h1 class="font-headline text-6xl font-black uppercase tracking-tighter leading-[0.9] italic">
          THE ROAD<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-quaternary">RECAP.</span>
        </h1>
        <p class="text-sm font-black text-white/40 tracking-[0.5em] mt-6 uppercase">2026 • L'aventure de Caro & Carlo</p>
      </div>

      <div v-if="currentSlideIdx === 1" class="w-full animate-in slide-in-from-bottom duration-700">
        <h2 class="text-secondary text-[11px] font-black uppercase tracking-[0.4em] mb-12">Le Bilan en chiffres</h2>
        <div class="space-y-12">
          <div>
            <p class="text-7xl font-headline font-black">{{ Math.round(totalDistance) }}</p>
            <p class="text-secondary font-black tracking-widest text-xs uppercase">Kilomètres dévorés</p>
          </div>
          <div>
            <p class="text-7xl font-headline font-black">{{ tripDays.length }}</p>
            <p class="text-primary font-black tracking-widest text-xs uppercase">Jours de liberté</p>
          </div>
          <div>
            <p class="text-7xl font-headline font-black">{{ totalMemories }}</p>
            <p class="text-quaternary font-black tracking-widest text-xs uppercase">Photos développées</p>
          </div>
        </div>
      </div>

      <div v-if="currentSlideIdx === 2" class="w-full h-full flex flex-col justify-center animate-in fade-in duration-1000">
        <div class="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 shadow-2xl">
          <img :src="getChapterPhoto(0)" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-8 left-8 text-left">
            <span class="px-3 py-1 bg-primary text-black text-[10px] font-black rounded-full uppercase">Chapitre I</span>
            <h3 class="text-3xl font-headline font-black uppercase mt-2">Le Grand Départ</h3>
          </div>
        </div>
        <p class="text-lg font-bold opacity-60">Tout a commencé à {{ tripDays[0]?.arrival_city }}...</p>
      </div>

      <div v-if="currentSlideIdx === 3" class="w-full h-full flex flex-col justify-center relative animate-in zoom-in duration-700">
        <div class="absolute inset-0 -z-10">
          <ClientOnly><div id="wrapped-map" class="w-full h-full opacity-40"></div></ClientOnly>
          <div class="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]"></div>
        </div>
        <h2 class="text-secondary text-[11px] font-black uppercase tracking-[0.4em] mb-4">Votre Sillon</h2>
        <p class="text-2xl font-bold px-6">D'Italie en Autriche, vous n'avez jamais regardé en arrière.</p>
      </div>

      <div v-if="currentSlideIdx === 4" class="w-full h-full flex flex-col justify-center animate-in slide-in-from-right duration-700">
        <div class="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 shadow-2xl rotate-2">
          <img :src="getChapterPhoto(1)" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-8 left-8 text-left">
            <span class="px-3 py-1 bg-secondary text-white text-[10px] font-black rounded-full uppercase">Chapitre II</span>
            <h3 class="text-3xl font-headline font-black uppercase mt-2">Plein Coeur</h3>
          </div>
        </div>
        <p class="text-lg font-bold opacity-60">Au milieu des montagnes et du bitume.</p>
      </div>

      <div v-if="currentSlideIdx === 5" class="w-full h-full flex flex-col justify-center animate-in zoom-in duration-700">
        <h2 class="text-tertiary text-[11px] font-black uppercase tracking-[0.4em] mb-12">Le Vibe-O-Mètre</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <span class="text-5xl mb-4 block">☀️</span>
            <p class="text-3xl font-black text-primary">85%</p>
            <p class="text-[9px] uppercase font-black opacity-40">De Soleil</p>
          </div>
          <div class="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <span class="text-5xl mb-4 block">🚐</span>
            <p class="text-3xl font-black text-secondary">100%</p>
            <p class="text-[9px] uppercase font-black opacity-40">De Kiff</p>
          </div>
        </div>
      </div>

      <div v-if="currentSlideIdx === 6" class="w-full h-full flex flex-col justify-center animate-in slide-in-from-left duration-700">
        <div class="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 shadow-2xl -rotate-2">
          <img :src="getChapterPhoto(2)" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-8 left-8 text-left">
            <span class="px-3 py-1 bg-quaternary text-black text-[10px] font-black rounded-full uppercase">Chapitre III</span>
            <h3 class="text-3xl font-headline font-black uppercase mt-2">Dernière Étape</h3>
          </div>
        </div>
        <p class="text-lg font-bold opacity-60">Arrivée héroïque à {{ tripDays[tripDays.length-1]?.arrival_city }}.</p>
      </div>

      <div v-if="currentSlideIdx === 7" class="w-full h-full flex flex-col justify-center animate-in fade-in duration-1000 px-4">
        <h2 class="text-white text-[11px] font-black uppercase tracking-[0.4em] mb-12">Territoires Marqués</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <div v-for="(city, i) in allCities" :key="i"
               class="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 font-headline font-black uppercase italic"
               :class="getRandomTextColor(i)">
            {{ city }}
          </div>
        </div>
      </div>

      <div v-if="currentSlideIdx === 8" class="w-full h-full flex flex-col justify-center animate-in zoom-in duration-700">
        <h2 class="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-10">Best Of Memories</h2>
        <div class="relative w-full h-[400px]">
          <div v-for="(img, i) in bestPhotos" :key="i"
               class="absolute inset-x-0 mx-auto w-64 bg-white p-2 pb-10 rounded-sm shadow-2xl transform transition-all duration-700"
               :style="{
                 transform: `rotate(${[-12, 8, -5, 10][i % 4]}deg) translate(${i * 4}px, ${i * -8}px)`,
                 zIndex: i
               }">
            <img :src="img" class="w-full h-48 object-cover rounded-sm shadow-inner" />
          </div>
        </div>
      </div>

      <div v-if="currentSlideIdx === 9" class="w-full h-full flex flex-col justify-center items-center animate-in zoom-in-95 duration-1000">
        <div id="insta-story" class="w-[300px] h-[540px] bg-[#0f0f0f] rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/10 to-quaternary/10 animate-gradient-xy"></div>
          <div class="p-8 text-left relative z-10 h-full flex flex-col">
            <h3 class="font-headline text-5xl font-black uppercase leading-[0.8] mb-12 italic">VIVRE<br><span class="text-primary">LIBRE.</span></h3>
            <div class="space-y-8 flex-1">
              <div>
                <p class="text-[9px] font-black text-secondary uppercase tracking-[0.3em] mb-1">Trajet accompli</p>
                <p class="text-4xl font-black tabular-nums">{{ Math.round(totalDistance) }} KM</p>
              </div>
              <div>
                <p class="text-[9px] font-black text-tertiary uppercase tracking-[0.3em] mb-1">Durée du voyage</p>
                <p class="text-4xl font-black tabular-nums">{{ tripDays.length }} JOURS</p>
              </div>
              <div>
                <p class="text-[9px] font-black text-quaternary uppercase tracking-[0.3em] mb-1">Statut</p>
                <p class="text-2xl font-black">MASTERCLASS ✅</p>
              </div>
            </div>
            <div class="mt-auto flex justify-between items-end">
              <div>
                <p class="text-xs font-black uppercase">Roadtrip 2026</p>
                <p class="text-[10px] opacity-40 font-bold uppercase">Caro & Carlo</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl border border-white/10">🚐</div>
            </div>
          </div>
        </div>
        <button @click="closeWrapped" class="mt-8 px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full shadow-2xl active:scale-95 pointer-events-auto">
          Terminer l'aventure
        </button>
      </div>

    </div>

    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-tr from-primary/30 via-secondary/30 to-quaternary/30 blur-[150px] animate-spin-slow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';

const router = useRouter();
const { $pb } = useNuxtApp();

const totalSlides = 10;
const currentSlideIdx = ref(0);
const progress = ref(0);
const tripDays = ref<any[]>([]);
const memories = ref<any[]>([]);
const totalDistance = ref(0);
let timer: any = null;

let map: any = null;
let L: any = null;

// --- COMPUTEDS ---
const totalMemories = computed(() => memories.value.length);
const allCities = computed(() => [...new Set(tripDays.value.map(d => d.arrival_city))]);

const bestPhotos = computed(() => {
  if (memories.value.length > 0) {
    return memories.value.slice(0, 5).map(m => $pb.getFileUrl(m, m.image));
  }
  return [
    'https://images.unsplash.com/photo-1533903173850-73a3891666c4?w=600',
    'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=600',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600'
  ];
});

// --- HELPERS ---
const getChapterPhoto = (index: number) => {
  if (memories.value.length > index) {
    // On essaie de prendre une photo correspondant au tiers du voyage
    const segment = Math.floor(memories.value.length / 3) * index;
    return $pb.getFileUrl(memories.value[segment], memories.value[segment].image);
  }
  return 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800';
};

const getRandomTextColor = (index: number) => {
  const colors = ['text-primary', 'text-secondary', 'text-tertiary', 'text-quaternary', 'text-white'];
  return colors[index % colors.length];
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

// --- LOGIQUE MAP ---
const initWrappedMap = async () => {
  if (!tripDays.value.length) return;
  L = (await import('leaflet')).default;
  map = L.map('wrapped-map', { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
  const coords = tripDays.value.filter(d => d.lat && d.lng).map(d => [d.lat, d.lng]);
  if (coords.length > 0) {
    const route = L.polyline(coords, { color: '#da57f5', weight: 6, opacity: 0.9, lineCap: 'round' }).addTo(map);
    map.fitBounds(route.getBounds(), { padding: [50, 50], animate: false });
  }
};

watch(currentSlideIdx, async (newIdx) => {
  if (newIdx === 3) { await nextTick(); initWrappedMap(); }
});

// --- LOGIQUE SLIDES ---
const startTimer = () => {
  clearInterval(timer);
  progress.value = 0;

  // BLOQUAGE DERNIÈRE SLIDE
  if (currentSlideIdx.value === totalSlides - 1) {
    progress.value = 100;
    return;
  }

  timer = setInterval(() => {
    progress.value += 1.2;
    if (progress.value >= 100) nextSlide();
  }, 50);
};

const nextSlide = () => {
  if (currentSlideIdx.value < totalSlides - 1) {
    currentSlideIdx.value++;
    startTimer();
  }
};

const nextSlideManual = () => { if (currentSlideIdx.value < totalSlides - 1) nextSlide(); };
const prevSlide = () => { if (currentSlideIdx.value > 0) { currentSlideIdx.value--; startTimer(); } };
const closeWrapped = () => { clearInterval(timer); router.push('/'); };

onMounted(async () => {
  try {
    // Fetch Days & Memories en parallèle
    const [daysData, memoriesData] = await Promise.all([
      $pb.collection('trips_days').getFullList({ sort: 'day_number' }),
      $pb.collection('memories').getFullList({ sort: 'created' })
    ]);

    tripDays.value = daysData;
    memories.value = memoriesData;

    // Calcul distance
    let dist = 0;
    for (let i = 0; i < tripDays.value.length - 1; i++) {
      const p1 = tripDays.value[i], p2 = tripDays.value[i+1];
      if (p1.lat && p1.lng && p2.lat && p2.lng) dist += calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng);
    }
    totalDistance.value = dist || 1245;

    startTimer();
  } catch (err) { console.error(err); }
});

onUnmounted(() => { clearInterval(timer); if (map) map.remove(); });
</script>

<style scoped>
.font-headline { font-family: 'Comfortaa', cursive; }
.animate-spin-slow { animation: spin 25s linear infinite; }
.animate-gradient-xy { background-size: 400% 400%; animation: gradientXY 10s ease infinite; }
@keyframes gradientXY { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.leaflet-container { background: transparent !important; }
</style>