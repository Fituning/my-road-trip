<template>
  <article
      :class="cardTheme.bg"
      class="flex-none w-[85vw] max-w-[340px] h-[80dvh] snap-center rounded-[3.5rem] shadow-2xl border border-white/20 flex flex-col relative overflow-hidden group transition-all duration-500"
  >
    <button @click="openDrawer" class="absolute top-6 right-6 z-20 w-11 h-11 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
    </button>

    <div class="w-full h-36 relative shrink-0">
      <img :src="day.image_url" :alt="day.arrival_city" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div class="px-6 pb-6 flex-1 flex flex-col relative z-10 -mt-8 text-white min-h-0">

      <div class="mb-4 flex justify-between items-start shrink-0">
        <div>
          <div class="inline-block px-4 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest mb-2 uppercase border border-white/20 backdrop-blur-md">
            Day {{ day.day_number }}
          </div>
          <h2 class="font-headline text-3xl font-black leading-tight drop-shadow-md line-clamp-2">
            {{ day.arrival_city }}
          </h2>

          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-xs font-black uppercase tracking-widest drop-shadow-sm">{{ day.date }}</span>
            <span v-if="cleanTravelTime" class="text-[10px] font-bold opacity-90 uppercase tracking-widest px-2 py-0.5 bg-black/20 rounded-full border border-white/10 flex items-center gap-1">
              🚐 {{ cleanTravelTime }}
            </span>
          </div>
        </div>
        <WeatherWidget
            :city="day.arrival_city"
            :lat="day.lat"
            :lng="day.lng"
            :date="day.date"
            class="scale-100 origin-top-right shrink-0 drop-shadow-lg"
        />
      </div>

      <nav class="flex p-1 bg-black/10 rounded-2xl mb-4 shrink-0 shadow-inner border border-white/5">
        <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            :class="activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="flex-1 overflow-y-auto hide-scrollbar pb-2">

        <div v-show="activeTab === 'info'" class="flex flex-col min-h-full animate-fade-in">
          <div class="mb-5">
            <h3 class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">📍 Route Plan</h3>
            <ul class="space-y-2">
              <li v-for="(activity, i) in parseActivities(day.activities)" :key="i" class="flex items-start gap-3 text-sm font-bold leading-tight">
                <span class="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></span>
                <span>{{ activity }}</span>
              </li>
            </ul>
          </div>

          <div v-if="day.parking_name" class="mt-auto bg-black/20 px-4 py-4 rounded-[2rem] border border-white/10 shadow-inner shrink-0">
            <div class="flex justify-between items-center mb-2">
              <span class="text-[8px] font-black text-white/50 uppercase tracking-widest">Base Camp</span>
              <span class="text-[7px] font-black px-2 py-0.5 rounded bg-white/20 border border-white/10 uppercase">
                {{ getBadgeText(day.booking_status) }}
              </span>
            </div>
            <p class="font-headline font-bold text-white text-sm mb-4 truncate">{{ day.parking_name }}</p>
            <a v-if="day.parking_link" :href="day.parking_link" target="_blank" class="w-full py-2.5 bg-white text-slate-900 font-black text-[11px] rounded-xl flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-all no-underline">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              OPEN MAPS
            </a>
          </div>
        </div>

        <div v-show="activeTab === 'links'" class="flex flex-col min-h-full animate-fade-in">
          <h3 class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">🔗 Ressources du jour</h3>

          <div v-if="parsedLinks.length > 0" class="flex flex-col gap-2.5">
            <a
                v-for="(link, lIdx) in parsedLinks"
                :key="lIdx"
                :href="link.url"
                target="_blank"
                class="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl flex items-center justify-between no-underline transition-transform active:scale-95 shadow-md"
            >
              <div class="flex items-center gap-3 truncate">
                <span class="text-base">🌍</span>
                <span class="text-[11px] font-black truncate uppercase tracking-wide">{{ link.name }}</span>
              </div>
              <svg class="w-4 h-4 opacity-30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center opacity-50 py-10">
            <span class="text-3xl mb-2">🏜️</span>
            <span class="text-[10px] font-black uppercase tracking-widest text-center">Aucun lien ajouté<br>pour le moment</span>
          </div>
        </div>

        <div v-show="activeTab === 'notes'" class="flex flex-col min-h-full animate-fade-in">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-[10px] font-black text-white/60 uppercase tracking-widest">📝 Log Book</h3>
            <span v-if="isUpdatingNote" class="text-[8px] font-black text-white animate-pulse uppercase">Saving...</span>
          </div>
          <textarea
              v-model="localNote"
              @blur="saveNote"
              placeholder="Cher journal, aujourd'hui..."
              class="flex-1 w-full min-h-[150px] bg-black/10 text-white text-sm p-4 rounded-2xl border border-white/10 focus:bg-black/20 outline-none resize-none hide-scrollbar placeholder:text-white/30"
          ></textarea>
        </div>

      </div>
    </div>

    <div class="absolute inset-x-0 bottom-0 bg-white z-50 rounded-t-[3rem] p-8 flex flex-col shadow-2xl transition-transform duration-500 text-slate-800" :class="isDrawerOpen ? 'translate-y-0 h-[92%]' : 'translate-y-full h-[92%]'">
      <div class="flex justify-between items-center mb-6 shrink-0">
        <h3 class="font-headline font-black text-xl">Modifier l'étape</h3>
        <button @click="closeDrawer" class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-4 pb-4 hide-scrollbar">
        <div>
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ville d'arrivée</label>
          <input v-model="editForm.arrival_city" type="text" class="w-full mt-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary text-sm" />
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Temps de route</label>
          <input v-model="editForm.travel_time" type="text" class="w-full mt-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Réservation</label>
            <select v-model="editForm.booking_status" class="w-full mt-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary text-[11px] font-bold appearance-none">
              <option value="pending">À réserver ⏳</option>
              <option value="booked">Réservé ✅</option>
              <option value="not_needed">Sans Résa 🏕️</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Spot Dodo</label>
            <input v-model="editForm.parking_name" type="text" class="w-full mt-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary text-sm" />
          </div>
        </div>
        <div>
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Lien Google Maps Spot</label>
          <input v-model="editForm.parking_link" type="url" class="w-full mt-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary text-sm" />
        </div>

        <div class="mt-2 border-t border-slate-100 pt-4">
          <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Liens Utiles</label>

          <div class="space-y-2 mb-3">
            <div v-for="(lk, i) in editLinks" :key="i" class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div class="truncate text-xs font-bold text-slate-700 w-3/4">{{ lk.name }}</div>
              <button @click="removeLink(i)" class="text-red-400 p-1 hover:bg-red-50 rounded-md transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <input v-model="newLinkName" type="text" placeholder="Nom (ex: Billet Bateau)" class="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-primary" />
            <div class="flex gap-2">
              <input v-model="newLinkUrl" type="url" placeholder="https://..." class="flex-1 p-2.5 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-primary" />
              <button @click="addLink" class="bg-slate-900 text-white px-4 rounded-xl text-lg font-black hover:bg-slate-800 transition-colors">+</button>
            </div>
          </div>
        </div>

      </div>

      <button @click="saveFullEdit" :disabled="isUpdatingFull" class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl mt-4 flex items-center justify-center gap-2 shrink-0">
        <span v-if="isUpdatingFull" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span>{{ isUpdatingFull ? 'Sauvegarde en cours...' : 'Save Changes' }}</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import WeatherWidget from "./WeatherWidget.vue";

const props = defineProps<{ day: any, index: number }>();
const emit = defineEmits(['refresh']);
const { $pb } = useNuxtApp();

// Navigation par Onglets
const activeTab = ref('info');
const tabs = [
  { id: 'info', label: '📍 Infos' },
  { id: 'links', label: '🔗 Liens' },
  { id: 'notes', label: '📝 Notes' }
];

const cardTheme = computed(() => {
  const themes = [
    { bg: 'bg-[#40e0d0]' }, { bg: 'bg-[#da57f5]' }, { bg: 'bg-[#e39e1c]' }, { bg: 'bg-[#a2d149]' }
  ];
  return themes[props.index % 4];
});

const localNote = ref(props.day.personal_notes || '');
const isDrawerOpen = ref(false);
const isUpdatingFull = ref(false);
const isUpdatingNote = ref(false);
const editForm = ref({ ...props.day });

// --- GESTION DES LIENS JSON ---
const editLinks = ref<any[]>([]);
const newLinkName = ref('');
const newLinkUrl = ref('');

const parsedLinks = computed(() => {
  if (!props.day.useful_links) return [];
  if (Array.isArray(props.day.useful_links)) return props.day.useful_links;
  if (typeof props.day.useful_links === 'string') {
    try { return JSON.parse(props.day.useful_links); } catch { return []; }
  }
  return [];
});

const addLink = () => {
  if (newLinkName.value && newLinkUrl.value) {
    editLinks.value.push({ name: newLinkName.value, url: newLinkUrl.value });
    newLinkName.value = '';
    newLinkUrl.value = '';
  }
};

const removeLink = (idx: number) => {
  editLinks.value.splice(idx, 1);
};
// ------------------------------

// Nettoyage du travel_time pour virer le "(depuis ...)"
const cleanTravelTime = computed(() => {
  if (!props.day.travel_time) return null;
  return props.day.travel_time.split('(')[0].trim();
});

const parseLocationInput = async (input: string) => {
  if (!input) return null;
  if (input.includes('maps.google.com') || input.includes('google.com/maps')) {
    const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const nameRegex = /\/maps\/place\/([^/]+)/;
    const coordMatch = input.match(coordRegex);
    const nameMatch = input.match(nameRegex);
    let extractedCity = 'Étape ' + props.day.day_number;
    if (nameMatch && nameMatch[1]) extractedCity = decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')).split(',')[0];
    if (coordMatch && coordMatch[1] && coordMatch[2]) return { arrival_city: extractedCity, lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
  }
  try {
    const data: any = await $fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=1`, { headers: { 'User-Agent': 'NuxtVanLifeApp' } });
    if (data && data.length > 0) return { arrival_city: input, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch (err) { console.error("Geocoding failed:", err); }
  return null;
};

const saveNote = async () => {
  if (localNote.value === props.day.personal_notes) return;
  isUpdatingNote.value = true;
  try {
    await $pb.collection('trips_days').update(props.day.id, { personal_notes: localNote.value });
    emit('refresh');
  } catch (err) {
    console.error(err);
  } finally {
    isUpdatingNote.value = false;
  }
};

const openDrawer = () => {
  editForm.value = { ...props.day, booking_status: props.day.booking_status || 'pending' };

  let linksArray = [];
  if (props.day.useful_links) {
    if (Array.isArray(props.day.useful_links)) linksArray = [...props.day.useful_links];
    else try { linksArray = JSON.parse(props.day.useful_links); } catch(e) {}
  }
  editLinks.value = linksArray;

  isDrawerOpen.value = true;
};

const closeDrawer = () => { isDrawerOpen.value = false; };

const saveFullEdit = async () => {
  isUpdatingFull.value = true;
  try {
    if (editForm.value.arrival_city !== props.day.arrival_city && !editForm.value.arrival_city.startsWith('http')) {
      const resolvedData = await parseLocationInput(editForm.value.arrival_city);
      if (resolvedData) {
        editForm.value.lat = resolvedData.lat;
        editForm.value.lng = resolvedData.lng;
      }
    }

    editForm.value.useful_links = editLinks.value;

    await $pb.collection('trips_days').update(props.day.id, editForm.value);
    closeDrawer();
    emit('refresh');
  } catch (err) {
    console.error(err);
  } finally {
    isUpdatingFull.value = false;
  }
};

const parseActivities = (data: any) => Array.isArray(data) ? data : [];
const getBadgeText = (status: string) => {
  const map: Record<string, string> = { booked: 'OK ✅', pending: 'WAIT ⏳', not_needed: 'FREE 🏕️' };
  return map[status] || '???';
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>