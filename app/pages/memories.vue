<template>
  <div class="min-h-[100dvh] bg-cork flex flex-col pt-8 pb-20 relative overflow-x-hidden">

    <header class="px-6 flex items-center justify-between mb-8 relative z-20">
      <NuxtLink to="/" class="w-12 h-12 bg-surface-bright/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-outline-variant/30 hover:-translate-y-1 transition-transform text-on-surface">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
      </NuxtLink>
      <div class="bg-surface-bright/90 backdrop-blur-md px-6 py-2 rounded-full shadow-md border border-outline-variant/30">
        <h1 class="font-headline text-xl font-extrabold text-on-surface tracking-wide">
          Memories Wall 📌
        </h1>
      </div>
      <div class="w-12"></div>
    </header>

    <section class="px-6 mb-10 relative z-20">
      <div class="bg-surface-bright/95 backdrop-blur-md p-5 rounded-[2rem] shadow-lg border border-surface-dim/50">
        <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
          📸 Épingler un nouveau souvenir
        </h3>

        <div class="flex flex-col gap-3">
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden" />

          <button @click="$refs.fileInput.click()" class="w-full bg-surface-container-low text-on-surface-variant text-sm p-3.5 rounded-xl border border-dashed border-outline-variant hover:border-primary transition-colors flex items-center justify-center gap-2">
            <span v-if="!selectedFile">Sélectionner une photo...</span>
            <span v-else class="text-primary font-bold">{{ selectedFile.name }}</span>
          </button>

          <div class="flex flex-col gap-2">
            <select v-model="uploadForm.day_ref" class="w-full p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/30 appearance-none font-medium">
              <option value="" disabled>Sélectionner l'étape du voyage...</option>
              <option v-for="day in tripsDays" :key="day.id" :value="day.id">
                Jour {{ day.day_number }} - {{ day.arrival_city }}
              </option>
            </select>

            <div class="flex gap-2">
              <select v-model="uploadForm.user" class="flex-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/30 appearance-none font-medium">
                <option value="Carlo">👦 Carlo</option>
                <option value="Caroline">👧 Caroline</option>
              </select>

              <select v-model="uploadForm.type" class="flex-1 p-3 bg-surface-container-low rounded-xl text-sm border border-surface-dim/30 appearance-none font-medium">
                <option value="cute">🥺 Mignonne</option>
                <option value="funny">🤪 Rigolo</option>
              </select>

              <button @click="uploadPhoto" :disabled="!selectedFile || !uploadForm.day_ref || isUploading" class="px-5 bg-tertiary text-on-tertiary font-bold rounded-xl shadow-md hover:scale-105 transition-all disabled:opacity-50">
                <span v-if="isUploading">...</span>
                <span v-else>📌</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="flex-1 px-4 relative z-10">
      <div v-if="status === 'pending'" class="text-center py-20 text-white/70 font-bold">
        On épingle vos souvenirs... 🔨
      </div>

      <div v-else class="grid grid-cols-2 gap-x-4 gap-y-10">
        <div v-for="memory in memories" :key="memory.id" class="polaroid-wrapper group relative" :class="getRandomTilt()">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
            <div class="w-4 h-4 rounded-full shadow-inner border border-black/20" :class="memory.user === 'Carlo' ? 'bg-primary' : 'bg-secondary'"></div>
          </div>

          <article class="bg-[#FAFAFA] p-2.5 pb-8 shadow-lg rounded-[2px] transition-transform hover:scale-105 hover:z-50">
            <div class="w-full aspect-square bg-gray-200 overflow-hidden shadow-inner">
              <img :src="$pb.files.getUrl(memory, memory.image)" class="w-full h-full object-cover" />
            </div>
            <div class="absolute bottom-1.5 left-0 w-full text-center px-2">
              <p class="font-headline text-[10px] font-extrabold text-on-surface/80 uppercase">{{ memory.user }}</p>
              <p class="font-body text-[10px] text-on-surface-variant italic">{{ formatType(memory.type) }}</p>
            </div>

            <button @click="deleteMemory(memory.id)" class="absolute -top-2 -right-2 bg-error text-on-error w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Page: Memories Wall
 * Persists photos to PocketBase 'memories' collection with metadata matching the strict schema.
 */
import { ref, watchEffect } from 'vue';

interface MemoryRecord {
  id: string;
  image: string;
  user: string;
  type: string;
  day_ref: string;
  collectionId: string;
  collectionName: string;
}

interface TripDay {
  id: string;
  day_number: number;
  arrival_city: string;
}

const { $pb } = useNuxtApp();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

// Form payload mapped exactly to pb_schema
const uploadForm = ref({
  user: 'Carlo',
  type: 'cute',
  day_ref: ''
});

// Fetching reference days for the dropdown
const { data: tripsDays } = await useAsyncData('tripsDaysList', async () => {
  try {
    return await $pb.collection('trips_days').getFullList<TripDay>({ sort: 'day_number' });
  } catch (err) {
    console.error("Failed to fetch trips_days:", err);
    return [];
  }
});

// Auto-select the first day if available
watchEffect(() => {
  if (tripsDays.value && tripsDays.value.length > 0 && !uploadForm.value.day_ref) {
    uploadForm.value.day_ref = tripsDays.value[0].id;
  }
});

// Fetching memories
const { data: memories, status, refresh } = await useAsyncData('memories', async () => {
  try {
    return await $pb.collection('memories').getFullList<MemoryRecord>({ sort: '-created' });
  } catch (err) {
    console.error("Failed to fetch memories:", err);
    return [];
  }
});

/**
 * Handles file selection from the user's device.
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) selectedFile.value = target.files[0];
};

/**
 * Uploads the image and metadata as a multipart/form-data request.
 */
const uploadPhoto = async () => {
  if (!selectedFile.value || !uploadForm.value.day_ref) return;
  isUploading.value = true;

  const formData = new FormData();
  formData.append('image', selectedFile.value);
  formData.append('user', uploadForm.value.user);
  formData.append('type', uploadForm.value.type);
  formData.append('day_ref', uploadForm.value.day_ref);

  try {
    await $pb.collection('memories').create(formData);
    selectedFile.value = null; // Reset visual selection
    await refresh(); // Refresh board
  } catch (err: any) {
    console.error("Upload failed - Details:", err.response?.data);
    alert("Upload impossible : " + (err.response?.message || err.message));
  } finally {
    isUploading.value = false;
  }
};

/**
 * Removes a memory record and its associated file from PB.
 */
const deleteMemory = async (id: string) => {
  if (!confirm('Supprimer ce souvenir ?')) return;
  try {
    await $pb.collection('memories').delete(id);
    await refresh();
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

/**
 * Maps the internal English schema type to a display-friendly French string.
 */
const formatType = (type: string) => {
  return type === 'cute' ? 'Mignonne' : 'Rigolo';
};

/**
 * Returns a randomized Tailwind rotation class.
 */
const getRandomTilt = () => {
  const tilts = ['-rotate-3', '-rotate-2', 'rotate-1', 'rotate-2', 'rotate-3'];
  return tilts[Math.floor(Math.random() * tilts.length)];
};
</script>

<style scoped>
/* Pure CSS Corkboard Texture */
.bg-cork {
  background-color: #cda87c;
  background-image: radial-gradient(#b89467 15%, transparent 16%), radial-gradient(#b89467 15%, transparent 16%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.3);
}
</style>