document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://valorant-api.com/v1';
    const agentContainer = document.getElementById('agent-container');
    
    // Cargar lista de agentes
    fetch(`${BASE_URL}/agents`)
        .then(res => res.json())
        .then(data => {
            const agents = data.data; // Lista de agentes
            agents.forEach(agent => {
                // Crear tarjeta de agente
                const agentCard = document.createElement('div');
                agentCard.className = 'bg-white dark:bg-gray-800 rounded shadow p-4 cursor-pointer';
                agentCard.innerHTML = `
                    <img src="${agent.displayIcon}" alt="${agent.displayName}" class="w-auto h-96 object-cover rounded mb-4">
                    <h3 class="text-xl font-semibold mb-2">${agent.displayName}</h3>
                    <button class="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700">
                        Ver más
                    </button>
                `;

                // Redirigir al detalle del agente al hacer clic en el botón
                agentCard.querySelector('button').addEventListener('click', (event) => {
                    event.stopPropagation();  // Evitar que el clic se propague a la tarjeta
                    window.location.href = `agentes.html?id=${agent.uuid}`;
                });

                agentContainer.appendChild(agentCard);
            });
        })
        .catch(error => console.error('Error al cargar los agentes:', error));
});
