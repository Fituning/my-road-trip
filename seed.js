import PocketBase from 'pocketbase';

// Configuration de l'accès (utilise l'URL externe car tu le lances depuis ton Mac)
const pb = new PocketBase('http://127.0.0.1:8091');

const itinerary = [
    {
        day_number: 1, date: "19 Mai", arrival_city: "Venise", travel_time: "3h00 (Depuis Milan)",
        activities: ["Récupération du VW California", "Route Milan-Venise", "Installation au camping"],
        booking_status: "pending", parking_name: "San Giuliano Venice Camper Park",
        image_url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000"
    },
    {
        day_number: 2, date: "20 Mai", arrival_city: "Ponte della Delizia", travel_time: "1h15",
        activities: ["Matinée à Venise", "Route vers le Frioul", "Retrouvailles avec le Papa"],
        booking_status: "not_needed", parking_name: "Chez la famille",
        image_url: "https://images.unsplash.com/photo-1516483638261-f4088921eece?q=80&w=1000"
    },
    {
        day_number: 3, date: "21 Mai", arrival_city: "Ponte della Delizia", travel_time: "0h00",
        activities: ["Temps en famille", "Visite de Valvasone et Spilimbergo", "San Daniele"],
        booking_status: "not_needed", parking_name: "Chez la famille",
        image_url: "https://images.unsplash.com/photo-1560537233-0664d4b2f171?q=80&w=1000"
    },
    {
        day_number: 4, date: "22 Mai", arrival_city: "Ponte della Delizia", travel_time: "0h00",
        activities: ["Matinée rando/balade", "Shopping et resto à Udine", "Temps en famille"],
        booking_status: "not_needed", parking_name: "Chez la famille",
        image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000"
    },
    {
        day_number: 5, date: "23 Mai", arrival_city: "Ponte della Delizia", travel_time: "0h00",
        activities: ["Temps en famille", "Visite du Château de Miramare", "Préparation logistique Autriche"],
        booking_status: "not_needed", parking_name: "Chez la famille",
        image_url: "https://images.unsplash.com/photo-1527668752968-14ce709b4dba?q=80&w=1000"
    },
    {
        day_number: 6, date: "24 Mai", arrival_city: "Lienz (Autriche)", travel_time: "3h00",
        activities: ["Passage de la frontière", "Visite de Lienz", "Check-in au camping avec vue sur les Dolomites"],
        booking_status: "booked", parking_name: "Camping Falken",
        image_url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000"
    },
    {
        day_number: 7, date: "25 Mai", arrival_city: "Lienz", travel_time: "0h00",
        activities: ["Randonnée (Iseltrail ou Dolomitenhütte)", "Session photo avec vue sur les falaises", "Détente au van"],
        booking_status: "booked", parking_name: "Camping Falken",
        image_url: "https://images.unsplash.com/photo-1543333995-a78aea2ffa94?q=80&w=1000"
    },
    {
        day_number: 8, date: "26 Mai", arrival_city: "Lienz", travel_time: "0h00",
        activities: ["Suite du trail (cascades de Umbalfälle)", "Profiter de l'eau turquoise", "Détente au camping"],
        booking_status: "booked", parking_name: "Camping Falken",
        image_url: "https://images.unsplash.com/photo-1596230529625-7ee10f7b09b6?q=80&w=1000"
    },
    {
        day_number: 9, date: "27 Mai", arrival_city: "Wilder Kaiser", travel_time: "1h45",
        activities: ["Route vers le Tyrol", "Lama Trekking à Ellmau", "Balade au lac Hintersteiner See"],
        booking_status: "pending", parking_name: "Camping vers Ellmau / Söll",
        image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000"
    },
    {
        day_number: 10, date: "28 Mai", arrival_city: "Feldkirch", travel_time: "2h40 (Depuis Innsbruck)",
        activities: ["Arrêt à Innsbruck", "Symbole Goldenes Dachl", "Montée en téléphérique Nordkettenbahn"],
        booking_status: "pending", parking_name: "Camping gratuit à Feldkirch (Frontière)",
        image_url: "https://images.unsplash.com/photo-1513106021000-168e5f56609d?q=80&w=1000"
    },
    {
        day_number: 11, date: "29 Mai", arrival_city: "Lugano", travel_time: "2h05 (Depuis Coire)",
        activities: ["Passage du col des Alpes", "Visite du Lac et Parc Ciani", "Vue panoramique au Monte Brè"],
        booking_status: "pending", parking_name: "Camping Lugano Lake",
        image_url: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1000"
    },
    {
        day_number: 12, date: "30 Mai", arrival_city: "Milan", travel_time: "1h20",
        activities: ["Dernière matinée à Lugano", "Route vers Milan", "Dernière nuit du voyage"],
        booking_status: "not_needed", parking_name: "Retour Milan / Maison",
        image_url: "https://images.unsplash.com/photo-1520440229-6469a149ac59?q=80&w=1000"
    },
    {
        day_number: 13, date: "31 Mai", arrival_city: "Milan", travel_time: "0h00",
        activities: ["Détente aux Bains QC Terme", "Visite du Duomo di Milano", "Fin du roadtrip et retour maison"],
        booking_status: "not_needed", parking_name: "Maison",
        image_url: "https://images.unsplash.com/photo-1620023617154-1d6ebbb4e4e3?q=80&w=1000"
    }
];

async function seed() {
    console.log("🚀 Lancement du remplissage de la base de données...");

    for (const day of itinerary) {
        try {
            await pb.collection('trips_days').create(day);
            console.log(`✅ Jour ${day.day_number} (${day.arrival_city}) ajouté !`);
        } catch (err) {
            console.error(`❌ Erreur sur le Jour ${day.day_number}:`, err.data);
        }
    }

    console.log("\n✨ Terminé ! Ta Roadmap est maintenant vivante.");
}

seed();