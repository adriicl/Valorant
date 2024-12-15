// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const agentId = urlParams.get('id');


if (!agentId) {
    // Mostrar un error si no hay un ID de agente en la URL
    document.getElementById('agent-details').innerHTML = `<p class="text-red-500 text-center">Error: No se encontró el ID del agente.</p>`;
} else {
    // Obtener los detalles del agente de la API
    const BASE_URL = 'https://valorant-api.com/v1';
    fetch(`${BASE_URL}/agents/${agentId}`)
        .then(res => res.json())
        .then(agentData => {
            const agent = agentData.data;

            // Rellenar los detalles del agente
            document.getElementById('agent-name').textContent = agent.displayName;
            document.getElementById('agent-description').textContent = agent.description;

            // Agregar la foto del agente en grande
            const agentImageContainer = document.getElementById('agent-image');
            const agentImage = document.createElement('img');
            agentImage.src = agent.fullPortrait;  // Asegúrate de que esta propiedad esté disponible
            agentImage.alt = `Imagen de ${agent.displayName}`;
            agentImage.className = 'w-full h-auto rounded-lg shadow-lg';  // Estilos para la imagen
            agentImageContainer.appendChild(agentImage);

            // Agregar habilidades como botones con imágenes
            const abilitiesContainer = document.getElementById('abilities');
            agent.abilities.forEach(ability => {
                const abilityButton = document.createElement('button');
                abilityButton.className = "p-4 bg-gray-200 dark:bg-gray-700 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition";
                
                // Crear una imagen para la habilidad
                const abilityIcon = document.createElement('img');
                abilityIcon.src = ability.displayIcon;
                abilityIcon.alt = ability.displayName || 'Habilidad';
                abilityIcon.className = 'w-16 h-16 object-cover'; // Ajusta el tamaño de la imagen según sea necesario

                // Añadir la imagen al botón
                abilityButton.appendChild(abilityIcon);

                // Evento para mostrar la descripción de la habilidad
                abilityButton.addEventListener('click', () => {
                    const descriptionContainer = document.getElementById('video-container');
                    if (ability.description) {
                        // Muestra la descripción de la habilidad
                        descriptionContainer.innerHTML = `<p class="text-center py-12">${ability.description}</p>`;
                    } else {
                        descriptionContainer.innerHTML = `<p class="text-center py-12">Descripción no disponible</p>`;
                    }
                });

                abilitiesContainer.appendChild(abilityButton);
            });

            // Mostrar video del agente si existe
            const videoContainer = document.getElementById('video-container');
            if (agent.video) {
                videoContainer.innerHTML = `<iframe class="w-full h-full rounded" src="${agent.video}" frameborder="0" allowfullscreen></iframe>`;
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('agent-details').innerHTML = `<p class="text-red-500 text-center">Error: No se pudo cargar el agente.</p>`;
        });
}
