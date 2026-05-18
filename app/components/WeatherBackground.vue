<template>
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000" :class="isLoaded ? 'opacity-100' : 'opacity-50'">

    <div v-if="computedWeather === 'Clear' && !isNight">
      <div class="absolute -top-6 -left-[30%] w-[130%] animate-drift-medium opacity-60 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
        <svg viewBox="0 0 1000 200" :class="computedWeather === 'Rain' ? 'text-blue-200/80' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,100 Q80,50 150,100 T300,90 T450,120 T650,80 T850,110 T1000,90 L1000,0 L0,0 Z" />
        </svg>
      </div>
      <div class="absolute -top-6 -left-[10%] w-[140%] animate-drift-fast opacity-60 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
        <svg viewBox="0 0 1000 200" :class="computedWeather === 'Rain' ? 'text-slate-300' : 'text-white'" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,120 Q100,60 200,120 T400,110 T600,140 T800,90 T1000,120 L1000,0 L0,0 Z" />
        </svg>
      </div>

      <div class="absolute top-4 right-2 flex items-center justify-center transition-transform duration-1000" :class="isLoaded ? 'scale-100' : 'scale-50 opacity-50'">
        <div class="absolute w-32 h-32 bg-[#e39e1c]/50 rounded-full blur-2xl animate-pulse"></div>
        <svg class="w-32 h-32 text-[#e39e1c] drop-shadow-[0_0_20px_rgba(227,158,28,0.4)] animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" fill="currentColor" />
        </svg>
      </div>

      <div class="absolute top-20 left-[20%] animate-fly-1"><svg class="w-5 h-5 text-slate-600 animate-flap flap-slow" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" /></svg></div>
      <div class="absolute top-12 left-[40%] animate-fly-2"><svg class="w-4 h-4 text-slate-500 animate-flap flap-fast" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" /></svg></div>
      <div class="absolute top-28 left-[65%] animate-fly-3"><svg class="w-6 h-6 text-slate-700 animate-flap flap-medium" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 Q7 5 12 10 Q17 5 22 12 Q17 8 12 14 Q7 8 2 12 Z" /></svg></div>
    </div>

    <div v-if="isNight" class="absolute inset-0">
      <div class="absolute top-16 left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
      <div class="absolute top-32 left-[80%] w-2 h-2 bg-white/80 rounded-full animate-pulse delay-300"></div>
      <div class="absolute top-24 left-[50%] w-1 h-1 bg-white/60 rounded-full animate-pulse delay-700"></div>
    </div>

    <div v-if="computedWeather === 'Clouds' || computedWeather === 'Rain'" class="absolute top-0 left-0 w-full h-64">
      <div class="absolute -top-6 -left-[30%] w-[130%] animate-drift-medium drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <svg viewBox="0 0 1000 200" :class="computedWeather === 'Rain' ? 'text-blue-100' : 'text-white'" fill="currentColor" preserveAspectRatio="none"><path d="M0,100 Q80,50 150,100 T300,90 T450,120 T650,80 T850,110 T1000,90 L1000,0 L0,0 Z" /></svg>
      </div>
      <div class="absolute -top-4 -left-[10%] w-[140%] animate-drift-slow drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <svg viewBox="0 0 1000 200" :class="computedWeather === 'Rain' ? 'text-blue-200' : 'text-white'" fill="currentColor" preserveAspectRatio="none"><path d="M0,80 Q50,40 100,80 T200,80 T300,60 T450,100 T600,70 T750,90 T900,60 T1000,80 L1000,0 L0,0 Z" /></svg>
      </div>
      <div class="absolute -top-6 -left-[10%] w-[140%] animate-drift-fast drop-shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
        <svg viewBox="0 0 1000 200" :class="computedWeather === 'Rain' ? 'text-slate-300' : 'text-white'" fill="currentColor" preserveAspectRatio="none"><path d="M0,120 Q100,60 200,120 T400,110 T600,140 T800,90 T1000,120 L1000,0 L0,0 Z" /></svg>
      </div>
    </div>

    <div v-if="computedWeather === 'Rain'" class="absolute inset-0">
      <div class="absolute -top-10 left-[15%] w-1.5 h-8 bg-blue-500/60 rounded-full animate-rain"></div>
      <div class="absolute -top-20 left-[45%] w-1.5 h-6 bg-blue-400/60 rounded-full animate-rain delay-100"></div>
      <div class="absolute -top-4 left-[75%] w-1.5 h-10 bg-blue-500/50 rounded-full animate-rain delay-300"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  displayWeather: string | null;
  isNight?: boolean;
}>();

// Si l'API n'a pas encore répondu (null), on force l'état "Clear" par défaut
// pour que les animations de nuages et le soleil tournent en fond.
const computedWeather = computed(() => {
  return props.displayWeather || 'Clear';
});

// Permet de déclencher l'animation d'opacité/zoom quand la vraie donnée arrive
const isLoaded = computed(() => {
  return props.displayWeather !== null;
});
</script>

<style scoped>
@keyframes drift { from { transform: translateX(-5%); } to { transform: translateX(5%); } }
.animate-drift-slow { animation: drift 30s ease-in-out infinite alternate; }
.animate-drift-medium { animation: drift 20s ease-in-out infinite alternate-reverse; }
.animate-drift-fast { animation: drift 10s ease-in-out infinite alternate; }

@keyframes fly-1 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(15px, -8px); } 66% { transform: translate(-10px, 5px); } }
@keyframes fly-2 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(-12px, 6px); } 66% { transform: translate(18px, -4px); } }
@keyframes fly-3 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(10px, 10px); } 66% { transform: translate(-15px, -8px); } }
.animate-fly-1 { animation: fly-1 18s ease-in-out infinite; }
.animate-fly-2 { animation: fly-2 24s ease-in-out infinite; }
.animate-fly-3 { animation: fly-3 22s ease-in-out infinite; }

@keyframes flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.4); } }
.animate-flap { animation: flap 0.8s ease-in-out infinite; transform-origin: center; }
.flap-fast { animation-duration: 1.4s; }
.flap-medium { animation-duration: 1.6s; }
.flap-slow { animation-duration: 1.8s; }

/* Animation de la pluie mise à jour pour chuter plus bas */
@keyframes rain-fall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(500px); opacity: 0; }
}
.animate-rain { animation: rain-fall 0.8s linear infinite; }
.delay-100 { animation-delay: 0.1s; }
.delay-300 { animation-delay: 0.3s; }
</style>