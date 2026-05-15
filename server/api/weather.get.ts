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

    let params: any = { units: 'metric', lang: 'fr', appid: config.openweatherApiKey };

    if (lat && lon) { params.lat = lat; params.lon = lon; }
    else if (originalCity) { params.q = cityMapping[originalCity] || originalCity; }
    else { return { error: 'Paramètres manquants' }; }

    try {
        // On lance les deux requêtes en parallèle pour aller plus vite
        const [currentReq, forecastReq] = await Promise.all([
            $fetch(`https://api.openweathermap.org/data/2.5/weather`, { params }),
            $fetch(`https://api.openweathermap.org/data/2.5/forecast`, { params })
        ]);

        // On renvoie la météo actuelle + les 8 prochaines prévisions (soit les prochaines 24h)
        return {
            current: currentReq,
            forecast: (forecastReq as any).list.slice(0, 8)
        };
    } catch (error: any) {
        console.error(`☁️ Météo introuvable`);
        return { error: 'Météo introuvable' };
    }
});