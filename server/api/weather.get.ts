import { defineEventHandler, getQuery } from 'h3';

const cityMapping: Record<string, string> = {
    'Lienz (Autriche)': 'Lienz,AT',
    'Wilder Kaiser': 'Ellmau,AT',
    'Ponte della Delizia': 'Casarsa della Delizia,IT',
};

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const originalCity = query.city as string;
    const lat = query.lat;
    const lon = query.lon;
    const config = useRuntimeConfig(event);

    // Configuration de base pour OpenWeather
    let params: any = {
        units: 'metric',
        lang: 'fr',
        appid: config.openweatherApiKey
    };

    // Si on a les coordonnées GPS (Page d'accueil)
    if (lat && lon) {
        params.lat = lat;
        params.lon = lon;
    }
    // Sinon on cherche par ville (Cartes de la Roadmap)
    else if (originalCity) {
        params.q = cityMapping[originalCity] || originalCity;
    } else {
        return { error: 'Paramètres manquants' };
    }

    try {
        return await $fetch(`https://api.openweathermap.org/data/2.5/weather`, { params });
    } catch (error: any) {
        console.error(`☁️ Météo introuvable`);
        return { error: 'Météo introuvable' };
    }
});