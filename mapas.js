const BASE_URL = "https://valorant-api.com/v1/maps"; // URL de la API de Valorant

let mapsData = [];

const fetchMapsData = async () => {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos
        mapsData = data.data || []; // Ajusta según la propiedad que contiene los mapas
        loadMaps(); // Llamar a la función para cargar los mapas
    } catch (error) {
        console.error('Error al cargar los mapas:', error);
    }
};

const loadMaps = () => {
    const mapsContainer = document.getElementById('maps-container');
    mapsContainer.innerHTML = ''; // Limpiar contenedor antes de añadir nuevos mapas

    // Verificar si hay datos
    if (mapsData.length === 0) {
        console.log('No se encontraron mapas.');
        return;
    }

    mapsData.forEach((map) => {
        console.log(map); // Verifica los datos de cada mapa

        const mapContainer = document.createElement('div');
        mapContainer.classList.add('mb-10', 'bg-gray-800', 'rounded-lg', 'p-4', 'shadow-md');

        // Crear título del mapa
        const mapTitle = document.createElement('h3');
        mapTitle.classList.add('text-2xl', 'font-semibold');
        mapTitle.textContent = map.displayName || 'Nombre no disponible'; // Ajusta según la API

        // Crear contenedor de imagen del mapa
        const mapImageContainer = document.createElement('div');
        mapImageContainer.classList.add('mt-4');
        const mapImage = document.createElement('img');
        mapImage.src = map.splash || 'default-image.jpg'; // Asegúrate de que esta propiedad sea correcta
        mapImage.alt = `Imagen del mapa ${map.displayName}`;
        mapImage.classList.add('w-full', 'h-96', 'rounded-lg', 'shadow-lg');

        // Añadir título, descripción e imagen al contenedor del mapa
        mapContainer.appendChild(mapTitle);
        mapContainer.appendChild(mapImage);

        // Añadir el contenedor del mapa al contenedor principal
        mapsContainer.appendChild(mapContainer);
    });
};

// Cargar los datos cuando la página se carga
window.onload = fetchMapsData;
