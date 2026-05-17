<template>
  <div class="min-h-[100dvh] bg-surface relative overflow-hidden font-body text-on-surface">
    <div class="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-secondary-container rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
    <div class="absolute top-[20%] right-[-5%] w-64 h-64 bg-tertiary-container rounded-full mix-blend-multiply filter blur-[60px] opacity-60"></div>
    <div class="absolute bottom-[20%] left-[-5%] w-72 h-72 bg-quaternary-container rounded-full mix-blend-multiply filter blur-[70px] opacity-50"></div>

    <main v-if="!isUnlocked && !isPublicRoute" class="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-6">

      <div class="relative w-full flex flex-col items-center mb-10">
        <svg class="absolute -top-8 -z-10 w-24 h-24 text-tertiary opacity-40 animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15a35 35 0 1 0 0 70 35 35 0 0 0 0-70zm0-10a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0V10a5 5 0 0 1 5-5zm0 80a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0v-5a5 5 0 0 1 5-5zm35-40a5 5 0 0 1 5-5h5a5 5 0 0 1 0 10h-5a5 5 0 0 1-5-5zM15 50a5 5 0 0 1-5-5H5a5 5 0 0 1 0-10h5a5 5 0 0 1 5 5zm59.7-24.7a5 5 0 0 1 7.1-7.1l3.5 3.5a5 5 0 0 1-7.1 7.1l-3.5-3.5zm-49.4 49.4a5 5 0 0 1-7.1 7.1l-3.5-3.5a5 5 0 0 1 7.1-7.1l3.5 3.5zm49.4 0a5 5 0 0 1 7.1 7.1l3.5-3.5a5 5 0 0 1-7.1-7.1l-3.5 3.5zm-49.4-49.4a5 5 0 0 1-7.1-7.1l-3.5 3.5a5 5 0 0 1 7.1 7.1l3.5-3.5z"/>
        </svg>
        <h1 class="font-headline text-5xl font-extrabold text-on-surface mb-1 text-center tracking-tight">
          Notre Roadtrip
        </h1>
        <p class="text-on-surface-variant text-center text-lg tracking-wide font-medium">
          Autriche 2026 🚐✨
        </p>
      </div>

      <div class="flex gap-5 mb-14">
        <div v-for="index in 4" :key="index"
             class="w-5 h-5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transition-all duration-300"
             :class="[
               currentPin.length >= index
                 ? (index === 1 ? 'bg-primary' : index === 2 ? 'bg-secondary' : index === 3 ? 'bg-tertiary' : 'bg-quaternary') + ' scale-110 shadow-surf -translate-y-2'
                 : 'bg-surface-variant/30'
             ]">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-y-6 gap-x-8 w-full max-w-[280px] mb-8">
        <button v-for="digit in 9" :key="digit" @click="appendDigit(digit)"
                class="w-16 h-16 flex items-center justify-center text-2xl font-headline font-bold shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-90 transition-all mx-auto"
                :class="[
                  digit % 2 === 0 ? 'rounded-[50%_50%_40%_60%/60%_40%_50%_50%]' : 'rounded-[40%_60%_50%_50%/50%_50%_60%_40%]',
                  digit === 5 ? 'bg-tertiary-container text-on-tertiary-container' :
                  digit === 2 || digit === 6 ? 'bg-secondary-container text-on-secondary-container' :
                  digit === 8 ? 'bg-quaternary-container text-on-quaternary-container' :
                  'bg-surface-container text-on-surface'
                ]">
          {{ digit }}
        </button>

        <button @click="clearPin" class="w-16 h-16 rounded-[40%_60%_50%_50%/50%_50%_60%_40%] bg-surface flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors mx-auto active:scale-90">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <button @click="appendDigit(0)" class="w-16 h-16 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-surface-container flex items-center justify-center text-2xl font-headline font-bold shadow-sm hover:-translate-y-1 active:scale-90 transition-all mx-auto">
          0
        </button>

        <button @click="submitPin"
                class="w-16 h-16 rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-primary flex items-center justify-center text-on-primary shadow-surf hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-90 mx-auto relative group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
               class="w-8 h-8 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            <circle cx="12" cy="10" r="1.5" fill="currentColor"></circle>
            <path d="M11 11.5h2l.5 3h-3z" fill="currentColor"></path>
          </svg>
        </button>
      </div>

      <div v-if="hasError" class="bg-error-container text-on-error-container px-6 py-2 rounded-full font-bold text-sm animate-bounce mt-2 shadow-sm border border-error/20">
        Oops, c'est pas le bon code ! 🙈
      </div>
    </main>
    <div v-else class="relative z-10 h-[100dvh] overflow-y-auto overflow-x-hidden">
      <NuxtPage />
      <VitePwaManifest />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'nuxt/app';

// 1. Détection de la route actuelle
const route = useRoute();

// 2. On définit quelles pages sont publiques (bypass du cadenas)
const isPublicRoute = computed(() => {
  return route.path === '/map';
});

const currentPin = ref<string>('');
const hasError = ref<boolean>(false);

// 3. Initialisation du cookie avec expiration de 30 jours
const authCookie = useCookie<string | null>('auth_unlocked', {
  maxAge: 60 * 60 * 24, // 60 * 60 * 24
  path: '/'
});

// L'état de verrouillage
const isUnlocked = ref<boolean>(authCookie.value === 'true');

const appendDigit = (digit: number): void => {
  if (currentPin.value.length < 4) {
    currentPin.value += digit.toString();
    hasError.value = false;
  }
};

const clearPin = (): void => {
  currentPin.value = '';
  hasError.value = false;
};

const submitPin = async (): Promise<void> => {
  if (currentPin.value.length !== 4) return;

  try {
    const { error } = await useFetch('/api/verify', {
      method: 'POST',
      body: { pin: currentPin.value },
    });

    if (!error.value) {
      // Déverrouillage OK, on sauve le cookie
      authCookie.value = 'true';
      isUnlocked.value = true;
    } else {
      hasError.value = true;
      currentPin.value = '';
    }
  } catch (err) {
    hasError.value = true;
    currentPin.value = '';
  }
};
</script>