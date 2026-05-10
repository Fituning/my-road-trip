import PocketBase from 'pocketbase';

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    // On force une valeur par défaut au cas où pour rassurer TS
    const pbUrl = (import.meta.server
        ? config.pocketbaseInternalUrl
        : config.public.pocketbaseUrl) as string;

    if (!pbUrl) {
        console.error("PocketBase URL is missing in runtimeConfig!");
    }

    const pb = new PocketBase(pbUrl);

    return {
        provide: {
            pb
        }
    };
});