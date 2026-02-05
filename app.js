// Variables globales
let servicios = [];
let servicioActual = null;
let carrito = [];
let precioActual = 0;

// Elementos del DOM
const serviciosGrid = document.getElementById('serviciosGrid');
const formularioContainer = document.getElementById('formularioContainer');
const btnVolver = document.getElementById('btnVolver');
const formulario = document.getElementById('formularioCotizacion');
const carritoItems = document.getElementById('carritoItems');
const carritoTotal = document.getElementById('carritoTotal');
const btnFinalizar = document.getElementById('btnFinalizar');

// Cargar servicios al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();
});

// Función para cargar servicios desde JSON
async function cargarServicios() {
    try {
        const response = await fetch('servicios.json');
        const data = await response.json();
        servicios = data.servicios;
        mostrarServicios();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los servicios. Por favor recargá la página.',
        });
    }
}

// Mostrar grid de servicios
function mostrarServicios() {
    serviciosGrid.innerHTML = '';
    
    servicios.forEach(servicio => {
        const card = document.createElement('div');
        card.className = 'servicio-card';
        card.innerHTML = `
            <div class="icono">${servicio.icono}</div>
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <div class="precio-desde">Desde $${servicio.precioBase.toLocaleString()}/mes</div>
        `;
        
        card.addEventListener('click', () => seleccionarServicio(servicio));
        serviciosGrid.appendChild(card);
    });
}

// Seleccionar un servicio
function seleccionarServicio(servicio) {
    servicioActual = servicio;
    serviciosGrid.style.display = 'none';
    formularioContainer.style.display = 'block';
    
    document.getElementById('servicioSeleccionadoTitulo').textContent = servicio.nombre;
    generarFormulario();
    
    // notificación
    Toastify({
        text: `Configurando ${servicio.nombre}`,
        duration: 2000,
        style: {
            background: "linear-gradient(to right, #533483, #0f3460)",
        }
    }).showToast();
}

// Volver al grid de servicios
btnVolver.addEventListener('click', () => {
    formularioContainer.style.display = 'none';
    serviciosGrid.style.display = 'grid';
    servicioActual = null;
    formulario.reset();
});

// Generar formulario dinámico
function generarFormulario() {
    const camposDinamicos = document.getElementById('camposDinamicos');
    camposDinamicos.innerHTML = '';
    
    // Generar campos según el servicio
    servicioActual.campos.forEach(campo => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        let inputHTML = '';
        
        if (campo.tipo === 'number') {
            inputHTML = `
                <label>${campo.label}</label>
                <input type="number" 
                        id="${campo.nombre}" 
                        name="${campo.nombre}"
                        min="${campo.min}" 
                        max="${campo.max}"
                        value="${campo.min}"
                        ${campo.required ? 'required' : ''}>
            `;
        } else if (campo.tipo === 'select') {
            inputHTML = `
                <label>${campo.label}</label>
                <select id="${campo.nombre}" name="${campo.nombre}" ${campo.required ? 'required' : ''}>
                    <option value="">Seleccionar...</option>
                    ${campo.opciones.map(op => 
                        `<option value="${op.valor}" data-precio="${op.precio}">${op.texto}</option>`
                    ).join('')}
                </select>
            `;
        }
        
        formGroup.innerHTML = inputHTML;
        camposDinamicos.appendChild(formGroup);
    });
    
    // Adicionales si existen
    if (servicioActual.adicionales && servicioActual.adicionales.length > 0) {
        const adicionalesGroup = document.createElement('div');
        adicionalesGroup.className = 'form-group';
        adicionalesGroup.innerHTML = '<label>Servicios Adicionales</label>';
        
        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';
        
        servicioActual.adicionales.forEach(adicional => {
            const checkItem = document.createElement('div');
            checkItem.className = 'checkbox-item';
            checkItem.innerHTML = `
                <input type="checkbox" 
                        id="ad_${adicional.id}" 
                        name="adicional"
                        value="${adicional.id}"
                        data-precio="${adicional.precio}">
                <label for="ad_${adicional.id}">${adicional.nombre}</label>
                <span class="precio-adicional">+$${adicional.precio.toLocaleString()}</span>
            `;
            checkboxGroup.appendChild(checkItem);
        });
        
        adicionalesGroup.appendChild(checkboxGroup);
        camposDinamicos.appendChild(adicionalesGroup);
    }
    
    // Eventos para calcular en tiempo real
    agregarEventosCalculo();
}

// Agregar eventos para calcular precio
function agregarEventosCalculo() {
    const inputs = formulario.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', calcularPrecio);
        input.addEventListener('input', calcularPrecio);
    });
    
    // calcular inicial
    calcularPrecio();
}

// Calcular precio actual
function calcularPrecio() {
    let precio = servicioActual.precioBase;
    
    // Sumar campos dinámicos
    servicioActual.campos.forEach(campo => {
        const input = document.getElementById(campo.nombre);
        
        if (campo.tipo === 'number' && input.value) {
            const cantidad = parseInt(input.value);
            if (campo.multiplicador) {
                precio += campo.multiplicador * cantidad;
            }
        } else if (campo.tipo === 'select' && input.value) {
            const opcionSeleccionada = input.options[input.selectedIndex];
            const precioAdicional = parseInt(opcionSeleccionada.dataset.precio) || 0;
            precio += precioAdicional;
        }
    });
    
    // Sumar adicionales
    const adicionalesChecked = formulario.querySelectorAll('input[name="adicional"]:checked');
    adicionalesChecked.forEach(checkbox => {
        precio += parseInt(checkbox.dataset.precio);
    });
    
    precioActual = precio;
    
    // Aplicar descuento por modalidad
    const modalidad = document.getElementById('modalidad').value;
    let precioFinal = precio;
    
    if (modalidad === 'trimestral') {
        precioFinal = precio * 0.95;
    } else if (modalidad === 'semestral') {
        precioFinal = precio * 0.90;
    } else if (modalidad === 'anual') {
        precioFinal = precio * 0.85;
    }
    
    // Mostrar precios
    document.getElementById('precioBase').textContent = `$${precio.toLocaleString()}`;
    document.getElementById('precioFinal').textContent = `$${Math.round(precioFinal).toLocaleString()}`;
}

// Agregar al carrito
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(formulario);
    const modalidad = document.getElementById('modalidad').value;
    
    if (!modalidad) {
        Toastify({
            text: "Por favor seleccioná una modalidad de contratación",
            duration: 3000,
            style: {
                background: "#ff9800",
            }
        }).showToast();
        return;
    }
    
    // Crear objeto del item
    const item = {
        id: Date.now(),
        servicio: servicioActual.nombre,
        modalidad: modalidad,
        precioBase: precioActual,
        precioFinal: calcularPrecioConModalidad(precioActual, modalidad),
        detalles: obtenerDetalles(formData)
    };
    
    carrito.push(item);
    actualizarCarrito();
    
    Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: 'El servicio se agregó a tu cotización',
        showConfirmButton: false,
        timer: 1500
    });
    
    // Volver a servicios
    btnVolver.click();
});

// Calcular precio con modalidad
function calcularPrecioConModalidad(precio, modalidad) {
    let descuento = 0;
    
    if (modalidad === 'trimestral') descuento = 0.05;
    else if (modalidad === 'semestral') descuento = 0.10;
    else if (modalidad === 'anual') descuento = 0.15;
    
    return Math.round(precio * (1 - descuento));
}

// Obtener detalles del servicio
function obtenerDetalles(formData) {
    const detalles = [];
    
    // Campos dinámicos
    servicioActual.campos.forEach(campo => {
        const valor = formData.get(campo.nombre);
        if (valor) {
            if (campo.tipo === 'select') {
                const select = document.getElementById(campo.nombre);
                const textoOpcion = select.options[select.selectedIndex].text;
                detalles.push(`${campo.label}: ${textoOpcion}`);
            } else {
                detalles.push(`${campo.label}: ${valor}`);
            }
        }
    });
    
    // Adicionales
    const adicionales = formData.getAll('adicional');
    if (adicionales.length > 0) {
        adicionales.forEach(id => {
            const adicional = servicioActual.adicionales.find(a => a.id === id);
            if (adicional) {
                detalles.push(`• ${adicional.nombre}`);
            }
        });
    }
    
    return detalles;
}

// Actualizar carrito
function actualizarCarrito() {
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">No hay servicios agregados</p>';
        carritoTotal.style.display = 'none';
        document.getElementById('cantidadItems').textContent = '(0)';
        return;
    }
    
    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        
        itemDiv.innerHTML = `
            <button class="btn-eliminar" onclick="eliminarItem(${item.id})">×</button>
            <h4>${item.servicio}</h4>
            <div class="detalle">Modalidad: ${item.modalidad}</div>
            ${item.detalles.map(d => `<div class="detalle">${d}</div>`).join('')}
            <span class="precio-item">$${item.precioFinal.toLocaleString()}/mes</span>
        `;
        
        carritoItems.appendChild(itemDiv);
    });
    
    // Calcular totales
    calcularTotales();
    
    carritoTotal.style.display = 'block';
    document.getElementById('cantidadItems').textContent = `(${carrito.length})`;
}

// Calcular totales con descuentos
function calcularTotales() {
    let total = carrito.reduce((sum, item) => sum + item.precioFinal, 0);
    
    // Descuento por múltiples servicios
    let descuentoMultiple = 0;
    const descuentoInfo = document.getElementById('descuentoInfo');
    
    if (carrito.length >= 3) {
        descuentoMultiple = 0.10;
        descuentoInfo.innerHTML = '🎉 ¡10% de descuento por contratar 3 o más servicios!';
        descuentoInfo.style.display = 'block';
    } else if (carrito.length === 2) {
        descuentoMultiple = 0.05;
        descuentoInfo.innerHTML = '✨ 5% de descuento por contratar 2 servicios';
        descuentoInfo.style.display = 'block';
    } else {
        descuentoInfo.style.display = 'none';
    }
    
    const totalConDescuento = Math.round(total * (1 - descuentoMultiple));
    document.getElementById('totalGeneral').textContent = `$${totalConDescuento.toLocaleString()}/mes`;
}

// Eliminar item del carrito
function eliminarItem(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
    
    Toastify({
        text: "Servicio eliminado",
        duration: 2000,
        style: {
            background: "#ff4444",
        }
    }).showToast();
}

// Finalizar cotización
btnFinalizar.addEventListener('click', async () => {
    const resultado = await Swal.fire({
        title: '¿Deseas solicitar este presupuesto?',
        html: `
            <p>Te enviaremos la cotización detallada a tu correo</p>
            <input type="email" id="emailCliente" class="swal2-input" placeholder="Tu email">
            <input type="text" id="nombreCliente" class="swal2-input" placeholder="Tu nombre">
            <input type="tel" id="telefonoCliente" class="swal2-input" placeholder="Tu teléfono">
        `,
        showCancelButton: true,
        confirmButtonText: 'Enviar Solicitud',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#533483',
        preConfirm: () => {
            const email = document.getElementById('emailCliente').value;
            const nombre = document.getElementById('nombreCliente').value;
            const telefono = document.getElementById('telefonoCliente').value;
            
            if (!email || !nombre || !telefono) {
                Swal.showValidationMessage('Por favor completá todos los campos');
                return false;
            }
            
            return { email, nombre, telefono };
        }
    });
    
    if (resultado.isConfirmed) {
        // acá iría la lógica para enviar al backend
        await Swal.fire({
            icon: 'success',
            title: '¡Solicitud enviada!',
            html: `
                <p>Gracias <strong>${resultado.value.nombre}</strong></p>
                <p>Te contactaremos a la brevedad al email <strong>${resultado.value.email}</strong></p>
                <p>Nuestro equipo se comunicará para coordinar detalles</p>
            `,
            confirmButtonColor: '#4CAF50'
        });
        
        // Limpiar carrito
        carrito = [];
        actualizarCarrito();
    }
});
