const BASE_URL = "https://valorant-api.com/v1";



const setupMenu = () => {
    const header = document.querySelector('header');
    header.innerHTML = `
        <div class="flex justify-between items-center p-4 bg-gray-800 shadow-md">
            <a href="index.html">
                <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-400">
                    Valorant
                </h1>
            </a>
            <nav class="hidden md:flex gap-6">
                <a href="index.html" class="text-gray-200 hover:text-red-400 text-xl transition">Agentes</a>
                <a href="mapas.html" class="text-gray-200 hover:text-red-400 text-xl transition">Mapas</a>
                <a href="armas.html" class="text-gray-200 hover:text-red-400 text-xl transition">Armas</a>
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


// Función para cargar la lista de agentes en index.html
const loadAgents = () => {
    const agentContainer = document.getElementById('agent-container');
    if (agentContainer) {
        // Aplicar el filtro isPlayableCharacter=true
        fetch(`${BASE_URL}/agents?isPlayableCharacter=true`)
            .then(res => res.json())
            .then(data => {
                const agents = data.data; // Filtrados desde la API
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
                        bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md flex flex-col items-center
                        hover:scale-105 hover:shadow-lg transition-transform
                    `;
                    abilityCard.innerHTML = `
                        <img src="${ability.displayIcon}" alt="${ability.displayName}" class="w-16 h-16 mb-4">
                        <p class="text-center text-gray-700 dark:text-gray-300">${ability.displayName || 'Habilidad'}</p>
                    `;
                    abilityCard.addEventListener('click', () => {
                        const videoContainer = document.getElementById('video-container');
                        videoContainer.innerHTML = `
                            <p class="text-center text-gray-600 dark:text-gray-400 py-4">
                                ${ability.description || 'Descripción no disponible'}
                            </p>
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

// Función para cargar las armas en armas.html
const loadWeapons = () => {
    const weaponsContainer = document.getElementById('weapons-container');
    if (weaponsContainer) {
        fetch(`${BASE_URL}/weapons`)
            .then(res => res.json())
            .then(data => {
                const weapons = data.data;
                weapons.forEach(weapon => {
                    const weaponCard = document.createElement('div');
                    weaponCard.className = `
                        bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-lg
                        hover:scale-105 hover:shadow-xl transition-transform p-6 cursor-pointer
                    `;
                    weaponCard.addEventListener('click', () => {
                        window.location.href = `detalle-arma.html?id=${weapon.uuid}`;
                    });
                    weaponCard.innerHTML = `
                        <img src="${weapon.displayIcon}" alt="${weapon.displayName}" class="w-full h-48 object-contain mb-4">
                        <h3 class="text-2xl font-bold text-red-400">${weapon.displayName}</h3>
                        <p class="text-gray-300 mt-2">${weapon.category.replace('EEquippableCategory::', '')}</p>
                    `;
                    weaponsContainer.appendChild(weaponCard);
                });
            })
            .catch(error => console.error('Error al cargar las armas:', error));
    }
};

// Función para cargar los detalles de un arma en detalle-arma.html
const loadWeaponDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const weaponId = urlParams.get('id');
    const weaponDetails = document.getElementById('weapon-details');

    if (weaponId && weaponDetails) {
        fetch(`${BASE_URL}/weapons/${weaponId}`)
            .then(res => res.json())
            .then(data => {
                const weapon = data.data;

                // Mostrar información del arma
                document.getElementById('weapon-name').textContent = weapon.displayName;
                document.getElementById('weapon-image').src = weapon.displayIcon;
                document.getElementById('weapon-image').alt = `Imagen de ${weapon.displayName}`;
                document.getElementById('weapon-category').textContent = weapon.category.replace('EEquippableCategory::', '');

                // Mostrar skins
                const skinsContainer = document.getElementById('weapon-skins');
                weapon.skins.forEach(skin => {
                    if (skin.displayIcon && skin.chromas.some(chroma => chroma.streamedVideo)) {
                        const skinCard = document.createElement('div');
                        skinCard.className = `
                            bg-gray-800 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform p-4
                        `;

                        // Primera cromática con video disponible
                        const videoChroma = skin.chromas.find(chroma => chroma.streamedVideo);

                        skinCard.innerHTML = `
                            <img src="${skin.displayIcon}" alt="${skin.displayName}" class="w-full h-48 object-contain mb-4">
                            <h3 class="text-xl font-bold text-red-400">${skin.displayName}</h3>
                            <button class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
                                Ver video
                            </button>
                        `;

                        skinCard.querySelector('button').addEventListener('click', () => {
                            const modal = document.createElement('div');
                            modal.className = `
                                fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50
                            `;
                            modal.innerHTML = `
                                <div class="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl">
                                    <button class="text-gray-400 hover:text-white text-2xl absolute top-4 right-6">
                                        ✕
                                    </button>
                                    <iframe class="w-full h-64 sm:h-96 rounded-lg" 
                                        src="${videoChroma.streamedVideo}" 
                                        frameborder="0" allowfullscreen>
                                    </iframe>
                                </div>
                            `;
                            modal.querySelector('button').addEventListener('click', () => {
                                modal.remove();
                            });
                            document.body.appendChild(modal);
                        });

                        skinsContainer.appendChild(skinCard);
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar los detalles del arma:', error);
                weaponDetails.innerHTML = `
                    <p class="text-red-500 text-center">Error: No se pudo cargar el arma.</p>
                `;
            });
    }
};

// Crear el botón dinámicamente y agregarlo al DOM
const addThemeButton = () => {
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = `
        fixed bottom-4 right-4 bg-gray-700 text-gray-200 p-3 rounded-full shadow-lg 
        hover:bg-gray-600 transition z-50
    `;
    button.textContent = '🌗'; // Icono del botón
    document.body.appendChild(button); // Agregar el botón al final del body

    // Configurar funcionalidad del botón
    setupThemeToggle(button);
};

// Configurar la funcionalidad del cambio de tema
const setupThemeToggle = (button) => {
    const body = document.body;

    const darkModeClass = 'dark';
    const darkModeBodyClasses = ['bg-gray-900', 'text-gray-200'];
    const lightModeBodyClasses = ['bg-gray-100', 'text-gray-900'];

    const enableDarkMode = () => {
        body.classList.add(darkModeClass);
        darkModeBodyClasses.forEach(cls => body.classList.add(cls));
        lightModeBodyClasses.forEach(cls => body.classList.remove(cls));
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        body.classList.remove(darkModeClass);
        lightModeBodyClasses.forEach(cls => body.classList.add(cls));
        darkModeBodyClasses.forEach(cls => body.classList.remove(cls));
        localStorage.setItem('theme', 'light');
    };

    // Alternar el tema al hacer clic en el botón
    button.addEventListener('click', () => {
        if (body.classList.contains(darkModeClass)) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Aplicar el tema guardado al cargar la página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
};






// Ejecutar funciones según la página actual
document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    addThemeButton();
    loadAgents();
    loadAgentDetails();
    loadMaps();
    loadWeapons();
    loadWeaponDetails();
});
