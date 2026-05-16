<template>
  <article
      :class="cardTheme.bg"
      class="flex-none w-[85vw] max-w-[340px] h-[72dvh] snap-center rounded-[3.5rem] shadow-2xl border border-white/20 flex flex-col relative overflow-hidden group transition-all duration-500"
  >
    <button @click="openDrawer" class="absolute top-6 right-6 z-20 w-11 h-11 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
    </button>

    <div class="w-full h-36 relative shrink-0">
      <img :src="day.image_url" :alt="day.arrival_city" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div class="px-6 pb-6 flex-1 flex flex-col relative z-10 -mt-8 text-white">
      <div class="mb-5 flex justify-between items-start">
        <div>
          <div class="inline-block px-4 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest mb-2 uppercase border border-white/20 backdrop-blur-md">
            Day {{ day.day_number }}
          </div>
          <h2 class="font-headline text-3xl font-black leading-tight drop-shadow-md">
            {{ day.arrival_city }}
          </h2>
          <span class="text-[10px] font-bold opacity-80 uppercase tracking-tighter">{{ day.date }}</span>
        </div>
        <WeatherWidget :city="day.arrival_city" class="scale-100 origin-top-right shrink-0 drop-shadow-lg" />
      </div>

      <div class="mb-4">
        <textarea
            v-model="localNote"
            @blur="saveNote"
            placeholder="Add a captain's note..."
            class="w-full bg-black/10 text-white text-xs px-3 py-3 rounded-2xl border border-white/10 focus:bg-black/20 outline-none resize-none hide-scrollbar placeholder:text-white/40"
            rows="2"
        ></textarea>
      </div>

      <div class="mb-5 flex-1 overflow-y-auto hide-scrollbar">
        <h3 class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">📍 Route Plan</h3>
        <ul class="space-y-2">
          <li v-for="(activity, i) in parseActivities(day.activities)" :key="i" class="flex items-start gap-3 text-sm font-bold leading-tight">
            <span class="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></span>
            <span>{{ activity }}</span>
          </li>
        </ul>
      </div>

      <div v-if="day.parking_name" class="mt-auto bg-black/20 px-4 py-4 rounded-[2rem] border border-white/10 shadow-inner">
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">Base Camp</span>
          <span class="text-[10px] font-black px-2 py-0.5 rounded bg-white/20 border border-white/10 uppercase">
            {{ getBadgeText(day.booking_status) }}
          </span>
        </div>
        <p class="font-headline font-bold text-white text-sm mb-4 truncate">{{ day.parking_name }}</p>
        <a v-if="day.parking_link" :href="day.parking_link" target="_blank" class="w-full py-3 bg-white text-slate-900 font-black text-[11px] rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-all no-underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          OPEN MAPS
        </a>
      </div>
    </div>

    <div class="absolute inset-x-0 bottom-0 bg-white z-50 rounded-t-[3rem] p-8 flex flex-col shadow-2xl transition-transform duration-500 text-slate-800" :class="isDrawerOpen ? 'translate-y-0 h-[85%]' : 'translate-y-full h-[85%]'">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-headline font-black text-xl">Edit Step</h3>
        <button @click="closeDrawer" class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">✕</button>
      </div>
      <div class="flex-1 overflow-y-auto space-y-4">
        <input v-model="editForm.arrival_city" type="text" class="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary" />
      </div>
      <button @click="saveFullEdit" class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl mt-4">Save Changes</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import WeatherWidget from "./WeatherWidget.vue";

const props = defineProps<{ day: any, index: number }>();
const emit = defineEmits(['refresh']);
const { $pb } = useNuxtApp();

// Color palette using your flashy project colors
const cardTheme = computed(() => {
  const themes = [
    { bg: 'bg-[#40e0d0]' }, // Primary (Turquoise)
    { bg: 'bg-[#da57f5]' }, // Secondary (Rose)
    { bg: 'bg-[#e39e1c]' }, // Tertiary (Mustard)
    { bg: 'bg-[#a2d149]' }  // Quaternary (Apple Green)
  ];
  return themes[props.index % 4];
});

// State & Logic
const localNote = ref(props.day.personal_notes || '');
const isDrawerOpen = ref(false);
const editForm = ref({ ...props.day });

const saveNote = async () => {
  if (localNote.value === props.day.personal_notes) return;
  try {
    await $pb.collection('trips_days').update(props.day.id, { personal_notes: localNote.value });
    emit('refresh');
  } catch (err) { console.error(err); }
};

const openDrawer = () => { isDrawerOpen.value = true; };
const closeDrawer = () => { isDrawerOpen.value = false; };
const saveFullEdit = async () => {
  try {
    await $pb.collection('trips_days').update(props.day.id, editForm.value);
    closeDrawer();
    emit('refresh');
  } catch (err) { console.error(err); }
};

const parseActivities = (data: any) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string' && data.startsWith('[')) {
    try { return JSON.parse(data); } catch { return []; }
  }
  return [];
};

const getBadgeText = (status: string) => {
  const map: Record<string, string> = { booked: 'OK ✅', pending: 'WAIT ⏳', not_needed: 'FREE 🏕️' };
  return map[status] || '???';
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>