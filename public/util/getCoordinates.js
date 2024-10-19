const axios = require('axios');

async function getCoordinates(address) {
    const apiKey = process.env.MAP_API_KEY;
    const geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;
    try {
        const response = await axios.get(geocodeUrl);
        if (response.data.items && response.data.items.length > 0) {
            const location = response.data.items[0].position;
            const latitude = location.lat;
            const longitude = location.lng;

            return { latitude, longitude };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error geocoding location:', error);
        throw new Error('Failed to geocode address');
    }
}

module.exports = { getCoordinates };
