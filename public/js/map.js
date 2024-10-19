// Ensure the API key is set before creating the platform
if (!key) {
    console.error("API key is missing!");
} else {
    // Initialize the platform object
    var platform = new H.service.Platform({
        apikey: key  // Use the apikey from window
    });

    // Obtain the default map types
    var defaultLayers = platform.createDefaultLayers();

    // Check if MapCoordinates is available
    if (MapCoordinates && MapCoordinates.length === 2) {
        var mapCenter = { lat: MapCoordinates[0], lng: MapCoordinates[1] };

        // Create and display the map
        var map = new H.Map(
            document.getElementById('map'),
            defaultLayers.vector.normal.map,
            {
                zoom: 11,
                center: mapCenter
            }
        );

        // Enable map events like panning and zooming
        var mapEvents = new H.mapevents.MapEvents(map);
        var behavior = new H.mapevents.Behavior(mapEvents);

        // Enable UI controls like zoom and map type switcher
        var ui = H.ui.UI.createDefault(map, defaultLayers);

        // Add marker
        var marker = new H.map.Marker(mapCenter);
        map.addObject(marker);

        // Optionally, center the map on the marker
        map.setCenter(mapCenter);
    } else {
        console.error("Invalid or missing coordinates");
    }
}
