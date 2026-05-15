<template>
  <article class="flex-none w-[85vw] max-w-sm h-[75dvh] snap-center bg-surface-bright rounded-[2.5rem] shadow-surf border border-surface-dim/30 flex flex-col relative overflow-hidden group">

    <button @click="openDrawer" class="absolute top-4 right-4 z-20 w-10 h-10 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface shadow-sm hover:scale-105 transition-transform">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
    </button>

    <div class="w-full h-40 relative shrink-0">
      <img :src="day.image_url" :alt="day.arrival_city" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-surface-bright via-surface-bright/20 to-transparent"></div>
    </div>

    <div class="px-6 pb-6 flex-1 flex flex-col relative z-10 -mt-6">

      <div class="mb-4 flex justify-between items-start gap-2">
        <div>
          <div class="inline-block px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-bold tracking-wide mb-2 uppercase border border-outline-variant/20 shadow-sm backdrop-blur-md">
            Jour {{ day.day_number }} • {{ day.date }}
          </div>
          <h2 class="font-headline text-3xl font-extrabold text-on-surface leading-tight">
            {{ day.arrival_city }}
          </h2>
        </div>

        <WeatherWidget :city="day.arrival_city" class="scale-90 origin-top-right shrink-0" />
      </div>

      <div class="mb-4">
        <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-2">
          📝 Captain's Notes
          <span v-if="isUpdatingNote" class="text-tertiary animate-pulse">Saving...</span>
        </label>
        <textarea
            v-model="localNote"
            @blur="saveNote"
            placeholder="Ajoute une note rapide ici..."
            class="w-full bg-surface-container-low text-on-surface text-sm p-3 rounded-xl border border-surface-dim/20 focus:outline-none focus:border-primary resize-none hide-scrollbar"
            rows="2"
        ></textarea>
      </div>

      <div class="mb-4 flex-1 overflow-y-auto hide-scrollbar">
        <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
          Au programme
        </h3>
        <ul class="space-y-2">
          <li v-for="(activity, i) in parseActivities(day.activities)" :key="i" class="flex items-start gap-2 text-sm text-on-surface font-medium leading-snug">
            <span class="text-secondary mt-0.5 text-lg leading-none">•</span>
            <span>{{ activity }}</span>
          </li>
        </ul>
      </div>

      <div v-if="day.parking_name" class="mt-auto bg-surface-container-lowest p-4 rounded-[1.5rem] border border-surface-dim/30 shadow-sm shrink-0">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Spot Dodo</h3>
          <span class="text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider" :class="getBadgeClass(day.booking_status)">
            {{ getBadgeText(day.booking_status) }}
          </span>
        </div>
        <p class="font-headline font-bold text-on-surface text-sm mb-3 line-clamp-1">{{ day.parking_name }}</p>
        <a v-if="day.parking_link" :href="day.parking_link" target="_blank" class="w-full py-2.5 bg-primary-container text-on-primary-container font-bold text-[13px] rounded-xl hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 text-center no-underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Ouvrir Maps
        </a>
      </div>
    </div>

    <div
        class="absolute inset-x-0 bottom-0 bg-surface-bright z-50 rounded-t-[2.5rem] p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out border-t border-surface-dim/30"
        :class="isDrawerOpen ? 'translate-y-0 h-[85%]' : 'translate-y-full h-[85%]'"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-headline font-bold text-xl text-on-surface">Modifier l'étape</h3>
        <button @click="closeDrawer" class="p-2 bg-surface-container rounded-full text-on-surface-variant">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-4">
        <div>
          <label class="text-xs font-bold text-on-surface-variant">Ville d'arrivée</label>
          <input v-model="editForm.arrival_city" type="text" class="w-full mt-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:border-primary outline-none" />
        </div>

        <div>
          <label class="text-xs font-bold text-on-surface-variant">Temps de route</label>
          <input v-model="editForm.travel_time" type="text" class="w-full mt-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:border-primary outline-none" />
        </div>

        <div>
          <label class="text-xs font-bold text-on-surface-variant">Statut Réservation</label>
          <div class="relative w-full mt-1">
            <select v-model="editForm.booking_status" class="w-full p-3 pr-10 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:border-primary outline-none appearance-none">
              <option value="" disabled>Choisis un statut...</option>
              <option value="pending">À réserver ⏳</option>
              <option value="booked">Réservé ✅</option>
              <option value="not_needed">Sans Résa 🏕️</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-on-surface-variant">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-on-surface-variant">Nom du Parking / Spot</label>
          <input v-model="editForm.parking_name" type="text" class="w-full mt-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:border-primary outline-none" />
        </div>

        <div>
          <label class="text-xs font-bold text-on-surface-variant">Lien Google Maps</label>
          <input v-model="editForm.parking_link" type="url" class="w-full mt-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:border-primary outline-none" />
        </div>
      </div>

      <button @click="saveFullEdit" :disabled="isUpdatingFull" class="w-full py-4 mt-2 bg-primary text-on-primary font-bold rounded-2xl flex justify-center items-center gap-2">
        <span v-if="isUpdatingFull">Sauvegarde...</span>
        <span v-else>Enregistrer les modifs</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WeatherWidget from "./WeatherWidget.vue";

/**
 * Interface representing the data structure of a trip day from PocketBase.
 */
interface TripDay {
  id: string;
  day_number: number;
  date: string;
  arrival_city: string;
  travel_time: string;
  activities: string[] | string | unknown;
  personal_notes: string;
  booking_status: 'booked' | 'pending' | 'not_needed' | '';
  parking_name: string;
  parking_link: string;
  image_url: string;
}

// Define Component Props and Emits
const props = defineProps<{ day: TripDay }>();
const emit = defineEmits(['refresh']);

// Access Nuxt app context to retrieve the PocketBase instance
const { $pb } = useNuxtApp();

// State for handling inline quick notes updates
const localNote = ref(props.day.personal_notes || '');
const isUpdatingNote = ref(false);

// State for handling the full edit drawer form
const isDrawerOpen = ref(false);
const isUpdatingFull = ref(false);
const editForm = ref({ ...props.day });

/**
 * Persists the inline note to the database when the user clicks outside the textarea.
 */
const saveNote = async () => {
  if (localNote.value === props.day.personal_notes) return; // Prevent unnecessary API calls

  isUpdatingNote.value = true;
  try {
    await $pb.collection('trips_days').update(props.day.id, {
      personal_notes: localNote.value
    });
    emit('refresh'); // Silently instruct parent to pull fresh data
  } catch (err) {
    console.error("Error saving note:", err);
  } finally {
    isUpdatingNote.value = false;
  }
};

/**
 * Opens the edit drawer and ensures the form is populated with the latest day data.
 */
const openDrawer = () => {
  // Ensure we have a valid default for the select input if it's empty
  const currentStatus = props.day.booking_status || '';
  editForm.value = { ...props.day, booking_status: currentStatus };
  isDrawerOpen.value = true;
};

/**
 * Closes the edit drawer.
 */
const closeDrawer = () => {
  isDrawerOpen.value = false;
};

/**
 * Saves all modified fields from the drawer form to the database.
 */
const saveFullEdit = async () => {
  isUpdatingFull.value = true;
  try {
    await $pb.collection('trips_days').update(props.day.id, editForm.value);
    closeDrawer();
    emit('refresh'); // Instruct parent to reload data
  } catch (err) {
    console.error("Error saving full edit:", err);
  } finally {
    isUpdatingFull.value = false;
  }
};

/**
 * Parses raw activity data into an iterable string array.
 * @param activitiesData Raw data from PocketBase (can be stringified JSON, array, or string)
 * @returns Array of activity strings
 */
const parseActivities = (activitiesData: unknown): string[] => {
  if (Array.isArray(activitiesData)) return activitiesData as string[];
  if (typeof activitiesData === 'string' && activitiesData.startsWith('[')) {
    try { return JSON.parse(activitiesData); }
    catch { return [activitiesData]; }
  }
  return [];
};

/**
 * Determines the appropriate CSS classes for the booking status badge.
 * @param status The current booking status
 * @returns Tailwind CSS class string
 */
const getBadgeClass = (status: TripDay['booking_status']): string => {
  const classMap: Record<string, string> = {
    booked: 'bg-quaternary-container text-on-quaternary-container',
    pending: 'bg-tertiary-container text-on-tertiary-container',
    not_needed: 'bg-secondary-container text-on-secondary-container'
  };
  return classMap[status] || 'bg-surface-variant text-on-surface-variant';
};

/**
 * Maps the internal booking status enum to a user-friendly display string.
 * @param status The current booking status
 * @returns Display text with emoji
 */
const getBadgeText = (status: TripDay['booking_status']): string => {
  const textMap: Record<string, string> = {
    booked: 'Réservé ✅',
    pending: 'À réserver ⏳',
    not_needed: 'Sans Résa 🏕️'
  };
  return textMap[status] || status || 'Non défini';
};
</script>

<style scoped>
/* Utility classes to hide standard scrollbars while retaining scroll functionality */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;    /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;            /* Chrome, Safari, and Opera */
}
</style>