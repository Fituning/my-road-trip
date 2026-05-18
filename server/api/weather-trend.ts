import { defineEventHandler, getQuery } from 'h3';

interface ForecastItem {
    dt: number;
    dt_txt: string;
    main: { temp: number };
    weather: Array<{ icon: string; main: string }>;
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const apiKey = process.env.NUXT_OPENWEATHER_API_KEY;

    const lat = query.lat;
    const lon = query.lon;
    const city = query.city;
    const rawDate = query.date as string;

    if (!apiKey) {
        throw createError({ statusCode: 500, statusMessage: 'Missing API Key' });
    }

    try {
        let url = 'https://api.openweathermap.org/data/2.5/forecast?units=metric';

        if (lat && lon) {
            url += `&lat=${lat}&lon=${lon}`;
        } else if (city) {
            url += `&q=${encodeURIComponent(city as string)}`;
        } else {
            return { error: 'Missing location' };
        }

        url += `&appid=${apiKey}`;

        const data = await $fetch<{ list: ForecastItem[] }>(url);

        if (!data || !data.list) return { trend: { temp: 20, icon: '01d' } };

        const dayMatch = rawDate ? rawDate.match(/\d+/) : null;
        const targetDay = dayMatch ? dayMatch[0].padStart(2, '0') : null;

        const dayForecasts = data.list.filter((item: ForecastItem) => {
            if (!targetDay) return true;
            const datePart = item.dt_txt.split(' ')[0];
            const dayPart = datePart.split('-')[2];
            return dayPart === targetDay;
        });

        const discoveryList = dayForecasts.length > 0 ? dayForecasts : data.list;

        // On cible 15h ou 12h pour la tendance
        const afternoonTrend = discoveryList.find((item: ForecastItem) =>
            item.dt_txt.includes('15:00:00') || item.dt_txt.includes('12:00:00')
        ) || discoveryList[0];

        return {
            trend: {
                temp: afternoonTrend.main.temp,
                icon: afternoonTrend.weather[0].icon
            }
        };

    } catch (error) {
        console.error('[Weather Trend API Error]:', error);
        return { trend: { temp: 20, icon: '01d' } };
    }
});