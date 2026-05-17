<template>
  <div class="min-h-[100dvh] bg-surface flex flex-col pt-8 pb-12 relative overflow-hidden">

    <div class="absolute top-[-10%] right-[-10%] w-72 h-72 bg-secondary-container/30 rounded-full blur-[80px] -z-10"></div>
    <div class="absolute bottom-[5%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[60px] -z-10"></div>

    <header class="px-6 flex items-center justify-between mb-6 relative z-10">
      <NuxtLink to="/" class="w-12 h-12 bg-surface-bright rounded-full flex items-center justify-center shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform text-on-surface">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
      </NuxtLink>
      <h1 class="font-headline text-2xl font-bold text-on-surface">Packing List</h1>
      <div class="w-12 h-12 flex items-center justify-center text-2xl">🎒</div>
    </header>

    <main class="flex-1 px-6 space-y-8 relative z-10 flex flex-col overflow-hidden">

      <section class="bg-surface-bright p-5 rounded-[2rem] shadow-sm border border-surface-dim/30 shrink-0">
        <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Ajouter un élément</h3>

        <div class="flex flex-col gap-3">
          <input
              v-model="newItemName"
              @keyup.enter="addItem"
              type="text"
              placeholder="Ex: Piles pour le drone..."
              class="w-full bg-surface-container-low text-on-surface text-sm p-3.5 rounded-xl border border-surface-dim/20 focus:outline-none focus:border-primary transition-colors"
          />

          <div class="flex gap-3">
            <div class="relative flex-1">
              <select
                  v-model="newItemCategory"
                  class="w-full p-3.5 pr-10 bg-surface-container-low rounded-xl text-sm border border-surface-dim/20 focus:outline-none focus:border-primary appearance-none transition-colors"
              >
                <option value="Van">🚐 Van</option>
                <option value="Tech">💻 Tech</option>
                <option value="Vêtements">👕 Vêtements</option>
                <option value="Soins">🪥 Soins</option>
                <option value="Activité">🏄‍♂️ Activité</option>
                <option value="Rando">🥾 Rando</option>
                <option value="Admin">🗂️ Admin</option>
                <option value="Autre">📦 Autre</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-on-surface-variant">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <button
                @click="addItem"
                :disabled="!newItemName.trim() || isAdding"
                class="px-6 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isAdding" class="animate-pulse">...</span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div v-if="status === 'pending'" class="text-center py-10 text-on-surface-variant font-bold animate-pulse flex-1">
        Check des valises... 🚐
      </div>

      <div v-else class="flex-1 overflow-y-auto hide-scrollbar space-y-8 pb-4">
        <section v-for="(items, category) in groupedItems" :key="category" class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-[2px] flex-1 bg-gradient-to-r from-transparent to-outline-variant/30"></div>
            <h2 class="font-headline text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">
              {{ formatCategory(category as string) }}
            </h2>
            <div class="h-[2px] flex-1 bg-gradient-to-l from-transparent to-outline-variant/30"></div>
          </div>

          <div class="grid gap-3">
            <div
                v-for="item in items"
                :key="item.id"
                @click="toggleItem(item)"
                class="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group"
                :class="[
                item.is_done
                  ? 'bg-surface-container-low border-transparent opacity-60'
                  : 'bg-surface-bright border-surface-dim/30 shadow-surf hover:scale-[1.02]'
              ]"
            >
              <div
                  class="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border-2 transition-colors"
                  :class="[
                  item.is_done
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-outline-variant group-hover:border-primary'
                ]"
              >
                <svg v-if="item.is_done" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <span
                  class="flex-1 font-medium text-on-surface transition-all"
                  :class="{ 'line-through text-on-surface-variant': item.is_done }"
              >
                {{ item.item }}
              </span>

              <span v-if="item.item.toLowerCase().includes('multiprise')" class="text-[10px] font-bold px-2 py-0.5 bg-error-container text-on-error-container rounded-full uppercase shrink-0">
                Vital
              </span>

              <button
                  v-if="item.is_done"
                  @click.stop="deleteItem(item.id)"
                  class="p-1.5 text-outline hover:text-error hover:bg-error-container rounded-lg transition-colors shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="px-6 pt-4 shrink-0 relative z-10">
      <div class="bg-surface-container-highest/50 backdrop-blur-md p-4 rounded-3xl border border-surface-dim/30">
        <div class="flex justify-between items-end mb-2 px-1">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progression</span>
          <span class="font-headline font-bold text-primary">{{ completionPercentage }}%</span>
        </div>
        <div class="w-full bg-surface-container-low rounded-full h-3 overflow-hidden border border-surface-dim/20">
          <div
              class="h-full bg-primary transition-all duration-700 ease-out"
              :style="{ width: completionPercentage + '%' }"
          ></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface PackingItem {
  id: string;
  item: string;
  category: string;
  is_done: boolean;
}

const { $pb } = useNuxtApp();

const newItemName = ref('');
const newItemCategory = ref('Van');
const isAdding = ref(false);

const { data: packingItems, status, refresh } = await useAsyncData('packingList', async () => {
  try {
    const records = await $pb.collection('packing_list').getFullList<PackingItem>({
      sort: 'category,item',
    });
    return structuredClone(records);
  } catch (err) {
    console.error("Failed to fetch packing_list:", err);
    return [];
  }
});

const groupedItems = computed(() => {
  if (!packingItems.value) return {};
  return packingItems.value.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);
});

const completionPercentage = computed(() => {
  if (!packingItems.value || packingItems.value.length === 0) return 0;
  const done = packingItems.value.filter(i => i.is_done).length;
  return Math.round((done / packingItems.value.length) * 100);
});

const addItem = async () => {
  if (!newItemName.value.trim() || isAdding.value) return;
  isAdding.value = true;
  try {
    await $pb.collection('packing_list').create({
      item: newItemName.value.trim(),
      category: newItemCategory.value,
      is_done: false
    });
    newItemName.value = '';
    await refresh();
  } catch (err) {
    console.error("Error adding item:", err);
  } finally {
    isAdding.value = false;
  }
};

const deleteItem = async (id: string) => {
  try {
    await $pb.collection('packing_list').delete(id);
    await refresh();
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};

const toggleItem = async (item: PackingItem) => {
  try {
    await $pb.collection('packing_list').update(item.id, {
      is_done: !item.is_done
    });
    await refresh();
  } catch (err) {
    console.error("Error toggling item:", err);
  }
};

// C'est ici que la magie opère ! 🪄
const formatCategory = (cat: string) => {
  const icons: Record<string, string> = {
    tech: '💻 Tech',
    van: '🚐 Van',
    vêtements: '👕 Vêtements',
    soins: '🪥 Soins',
    activité: '🏄‍♂️ Activité',
    rando: '🥾 Rando',
    admin: '🗂️ Admin',
    autre: '📦 Autre'
  };

  // On met la catégorie en minuscule pour matcher le dico
  const lowerCat = cat.toLowerCase();

  // Si la catégorie est connue, on renvoie l'icône, sinon on met le fallback générique
  return icons[lowerCat] || `🏷️ ${cat}`;
};
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