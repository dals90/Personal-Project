const REGLAS = {
    base: ["Pasaporte/ID", "Cargador", "Botiquín", "Ropa interior", "Desodorante", "Corta uñas"],
    clima: {
        frio: ["Abrigo térmico", "Bufanda", "Medias gruesas", "Gorro"],
        calor: ["Camisetas ligeras", "Lentes de sol", "Sandalias", "Gorra"]
    },
    actividades: {
        senderismo: ["Botas de montaña", "Capa de lluvia", "Repelente", "Bastones", "Camelback"],
        playa: ["Traje de baño", "Toalla microfibra", "Bloqueador", "Bolsa impermeable"],
        urbano: ["Zapatos cómodos", "Batería externa", "Guía", "Mochila pequeña"]
    }
};

async function generarLista() {
    const ciudadInput = document.getElementById('ciudad').value;
    const actividad = document.getElementById('actividad').value;
    const API_KEY = '43796d67bb5bb4151478ea63a516276d'; 

    if (!ciudadInput) return alert("Por favor, escribe una ciudad");

    try {
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudadInput}&units=metric&appid=${API_KEY}&lang=es`);
        
        if (!respuesta.ok) throw new Error("Ciudad no encontrada");
        
        const datos = await respuesta.json();
        const tempReal = Math.round(datos.main.temp);
        const desc = datos.weather[0].description;
        const nombreCiudadReal = datos.name;

        let listaTotal = [...REGLAS.base, ...REGLAS.actividades[actividad]];
        if (tempReal < 16) listaTotal.push(...REGLAS.clima.frio);
        if (tempReal > 24) listaTotal.push(...REGLAS.clima.calor);

        renderizarItems(listaTotal, nombreCiudadReal, tempReal, desc);

    } catch (error) {
        alert("Error: No pudimos obtener el clima. Intenta con 'Ciudad, País' (ej: San José, CR)");
        console.error(error);
    }
}

function renderizarItems(lista, ciudad, temp, desc) {
    const contenedor = document.getElementById('contenedorItems');
    contenedor.innerHTML = '';

    lista.forEach((item, index) => {
        const keyGuardado = `packsmart_${ciudad}_${item}`;
        const estaChequeado = localStorage.getItem(keyGuardado) === 'true';

        const li = document.createElement('li');
        li.className = `flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer ${estaChequeado ? 'item-checked' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${estaChequeado ? 'checked' : ''} class="w-5 h-5 rounded-full border-gray-300 text-blue-600 pointer-events-none">
            <span class="text-gray-700 font-medium">${item}</span>
        `;

        li.onclick = function() {
            const cb = this.querySelector('input');
            cb.checked = !cb.checked;
            this.classList.toggle('item-checked');
            localStorage.setItem(keyGuardado, cb.checked);
        };

        contenedor.appendChild(li);
    });

    document.getElementById('placeholder').classList.add('hidden');
    document.getElementById('seccionLista').classList.remove('hidden');
    document.getElementById('nombreCiudad').innerText = `- ${ciudad}`;
    document.getElementById('climaInfo').innerText = `${temp}°C`;
    document.getElementById('climaDesc').innerText = desc;
}