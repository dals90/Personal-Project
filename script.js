// 1. Diccionario de Reglas
const REGLAS = {
    base: ["Pasaporte", "Cargador", "Medicamentos", "Ropa interior", "Desodorante", "Corta uñas"],
    clima: {
        frio: ["Abrigo térmico", "Bufanda", "Medias gruesas", "Gorro"],
        calor: ["Camisetas ligeras", "Lentes de sol", "Sandalias", "Gorra"]
    },
    actividades: {
        senderismo: ["Botas de montaña", "Capa de lluvia", "Repelente", "Bastones de apoyo", "Camelback"],
        playa: ["Traje de baño", "Toalla de microfibra", "Bloqueador solar", "Bolsa impermeable"],
        urbano: ["Zapatos cómodos", "Batería externa", "Guía del lugar", "Mochila pequeña"]
    }
};

// 2. Función Principal
async function generarLista() {
    const ciudad = document.getElementById('ciudad').value;
    const actividad = document.getElementById('actividad').value;
    const API_KEY = 'TU_API_KEY_AQUI'; // <--- Reemplaza con tu llave de OpenWeather

    if (!ciudad) return alert("Por favor, escribe una ciudad");

    try {
        // Llamada real a la API
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${API_KEY}&lang=es`);
        
        if (!respuesta.ok) throw new Error("Ciudad no encontrada");
        
        const datosClima = await respuesta.json();
        const tempReal = Math.round(datosClima.main.temp);
        const descripcion = datosClima.weather[0].description;

        // Construir Lista
        let listaTotal = [...REGLAS.base, ...REGLAS.actividades[actividad]];
        if (tempReal < 16) listaTotal.push(...REGLAS.clima.frio);
        if (tempReal > 24) listaTotal.push(...REGLAS.clima.calor);

        renderizarItems(listaTotal, ciudad, tempReal, descripcion);

    } catch (error) {
        alert("No pudimos encontrar esa ciudad. Revisa la ortografía.");
        console.error(error);
    }
}

// 3. Función de Renderizado
function renderizarItems(lista, ciudad, temp, desc) {
    const contenedor = document.getElementById('contenedorItems');
    contenedor.innerHTML = '';

    lista.forEach((item, index) => {
        const idUnico = `item-${index}`;
        const li = document.createElement('li');
        
        // Recuperar estado guardado
        const estaChequeado = localStorage.getItem(ciudad + item) === 'true';

        li.className = `flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer ${estaChequeado ? 'item-checked' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${estaChequeado ? 'checked' : ''} class="w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="text-gray-700 font-medium">${item}</span>
        `;

        // Evento para guardar progreso
        li.onclick = function() {
            const cb = this.querySelector('input');
            cb.checked = !cb.checked;
            this.classList.toggle('item-checked');
            localStorage.setItem(ciudad + item, cb.checked);
        };

        contenedor.appendChild(li);
    });

    // Actualizar UI
    document.getElementById('placeholder').classList.add('hidden');
    document.getElementById('seccionLista').classList.remove('hidden');
    document.getElementById('nombreCiudad').innerText = `- ${ciudad}`;
    document.getElementById('climaInfo').innerText = `${temp}°C - ${desc}`;
}