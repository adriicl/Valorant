const BASE_URL = "https://valorant-api.com/v1";

// Función para generar el menú dinámico
const setupMenu = () => {
    // Seleccionar el header de cada página
    const header = document.querySelector('header');
    header.innerHTML = `
        <div class="flex justify-between items-center p-4 bg-gray-800 shadow-md">
            <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-400">
                Valorant
            </h1>
            <nav class="hidden md:flex gap-6">
                <a href="index.html" class="text-gray-200 hover:text-red-400 text-xl transition">Agentes</a>
                <a href="mapas.html" class="text-gray-200 hover:text-red-400 text-xl transition">Mapas</a>
                <a href="Armas.html" class="text-gray-200 hover:text-red-400 text-xl transition">Armas</a>
            </nav>
            <!-- Menú hamburguesa para móvil -->
            <button id="menu-toggle" class="md:hidden text-gray-200 hover:text-red-400 text-2xl focus:outline-none">
                ☰
            </button>
        </div>
        <!-- Menú desplegable en móviles -->
        <nav id="mobile-menu" class="hidden fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center gap-6 z-50">
            <a href="index.html" class="text-gray-200 text-3xl hover:text-red-400 transition">Agentes</a>
            <a href="mapas.html" class="text-gray-200 text-3xl hover:text-red-400 transition">Mapas</a>
            <a href="armas.html" class="text-gray-200 text-3xl hover:text-red-400 transition">Armas</a>
            <button id="close-menu" class="text-gray-200 text-2xl hover:text-red-400 transition mt-8">
                Cerrar ✕
            </button>
        </nav>
    `;

    // Configurar el comportamiento del menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
};

// Función para cargar la lista de agentes en el index.html
const loadAgents = () => {
    const agentContainer = document.getElementById('agent-container');
    if (agentContainer) {
        fetch(`${BASE_URL}/agents`)
            .then(res => res.json())
            .then(data => {
                const agents = data.data;
                agents.forEach(agent => {
                    const agentCard = document.createElement('div');
                    agentCard.className = `
                        relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-lg
                        hover:scale-105 hover:shadow-2xl transition-all overflow-hidden cursor-pointer
                    `;
                    agentCard.addEventListener('click', () => {
                        window.location.href = `agentes.html?id=${agent.uuid}`;
                    });
                    agentCard.innerHTML = `
                        <img src="${agent.displayIcon}" alt="${agent.displayName}" class="absolute top-0 right-0 opacity-20 w-full h-full object-cover">
                        <div class="relative z-10 p-6">
                            <h3 class="text-2xl font-bold text-red-400 mb-4">${agent.displayName}</h3>
                            <p class="text-gray-300">Explora las habilidades y detalles del agente.</p>
                        </div>
                    `;
                    agentContainer.appendChild(agentCard);
                });
            })
            .catch(error => console.error('Error al cargar los agentes:', error));
    }
};

// Función para cargar los detalles de un agente en agentes.html
const loadAgentDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('id');
    const agentDetails = document.getElementById('agent-details');

    if (agentId && agentDetails) {
        fetch(`${BASE_URL}/agents/${agentId}`)
            .then(res => res.json())
            .then(agentData => {
                const agent = agentData.data;

                document.getElementById('agent-name').textContent = agent.displayName;
                document.getElementById('agent-description').textContent = agent.description;

                const agentImage = document.createElement('img');
                agentImage.src = agent.fullPortrait;
                agentImage.alt = `Imagen de ${agent.displayName}`;
                agentImage.className = 'w-full h-auto rounded-lg shadow-lg';
                document.getElementById('agent-image').appendChild(agentImage);

                const abilitiesContainer = document.getElementById('abilities');
                agent.abilities.forEach(ability => {
                    const abilityCard = document.createElement('div');
                    abilityCard.className = `
                        bg-gray-800 p-4 rounded shadow-md flex flex-col items-center
                        hover:scale-105 hover:shadow-lg transition-transform
                    `;
                    abilityCard.innerHTML = `
                        <img src="${ability.displayIcon}" alt="${ability.displayName}" class="w-16 h-16 mb-4">
                        <p class="text-center text-gray-300">${ability.displayName || 'Habilidad'}</p>
                    `;
                    abilityCard.addEventListener('click', () => {
                        const videoContainer = document.getElementById('video-container');
                        videoContainer.innerHTML = `
                            <p class="text-center text-gray-400 py-4">${ability.description || 'Descripción no disponible'}</p>
                        `;
                    });
                    abilitiesContainer.appendChild(abilityCard);
                });

                if (agent.video) {
                    document.getElementById('video-container').innerHTML = `
                        <iframe class="w-full h-64 rounded" src="${agent.video}" frameborder="0" allowfullscreen></iframe>
                    `;
                }
            })
            .catch(err => {
                console.error(err);
                agentDetails.innerHTML = `
                    <p class="text-red-500 text-center">Error: No se pudo cargar el agente.</p>
                `;
            });
    }
};

// Función para cargar los mapas en mapas.html
const loadMaps = () => {
    const mapsContainer = document.getElementById('maps-container');
    if (mapsContainer) {
        fetch(`${BASE_URL}/maps`)
            .then(res => res.json())
            .then(data => {
                const maps = data.data;
                maps.forEach(map => {
                    const mapCard = document.createElement('div');
                    mapCard.className = `
                        bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-lg
                        hover:scale-105 hover:shadow-xl transition-transform p-6
                    `;
                    mapCard.innerHTML = `
                        <h3 class="text-2xl font-bold text-red-400 mb-4">${map.displayName || 'Nombre no disponible'}</h3>
                        <img src="${map.splash}" alt="${map.displayName}" class="w-full h-64 object-cover rounded-lg">
                    `;
                    mapsContainer.appendChild(mapCard);
                });
            })
            .catch(error => console.error('Error al cargar los mapas:', error));
    }
};

// Ejecutar funciones según la página actual
document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    loadAgents();
    loadAgentDetails();
    loadMaps();
});
