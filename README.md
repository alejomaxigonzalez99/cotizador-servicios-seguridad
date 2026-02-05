# SecureGuard - Cotizador de Servicios de Seguridad

## Descripción del Proyecto
Simulador interactivo de cotización para una empresa de seguridad privada. Permite a los usuarios configurar y cotizar diferentes servicios de seguridad con precios dinámicos y descuentos por modalidad de contratación.

## Características Principales

### Servicios Disponibles
1. **Seguridad Empresarial** - Protección para empresas
2. **Seguridad del Hogar** - Monitoreo residencial 24/7
3. **Rastreo GPS Vehicular** - Monitoreo de flotas
4. **Seguridad para Eventos** - Personal especializado
5. **Seguridad VIP** - Protección ejecutiva
6. **Custodia y Traslado de Valores** - Transporte seguro

### Funcionalidades
- Formularios dinámicos según el servicio seleccionado
- Cálculo de precios en tiempo real
- Sistema de carrito de cotización
- Descuentos por modalidad (Trimestral, Semestral, Anual)
- Descuentos por contratación múltiple (2 servicios: 5%, 3+: 10%)
- Adicionales personalizables por servicio
- Interfaz moderna y responsiva
- Notificaciones con Toastify y SweetAlert2

## Tecnologías Utilizadas

### Front-end
- HTML5
- CSS3 (Diseño moderno minimalista corporativo)
- JavaScript Vanilla (ES6+)

### Librerías Externas
- **SweetAlert2** - Alertas y modales
- **Toastify JS** - Notificaciones toast

### Datos
- JSON local (`servicios.json`) - Simula backend

## Estructura del Proyecto

```
ProyectoFinal/
│
├── index.html          # Estructura principal
├── styles.css          # Estilos del proyecto
├── app.js             # Lógica JavaScript
├── servicios.json     # Datos de servicios
└── README.md          # Este archivo explicativo de mi proyecto
```


## Flujo de Uso

1. **Selección de Servicio**
   - El usuario ve las 6 opciones de servicios
   - Click en la tarjeta del servicio deseado

2. **Configuración**
   - Se muestra un formulario dinámico
   - Los campos varían según el servicio
   - Puede seleccionar adicionales
   - Elige modalidad de contratación

3. **Cotización**
   - Ve el precio calculado en tiempo real
   - Puede agregar al carrito

4. **Carrito**
   - Aparece en la barra lateral
   - Muestra todos los servicios agregados
   - Calcula descuentos automáticamente
   - Puede eliminar items

5. **Finalización**
   - Click en "Solicitar Presupuesto"
   - Completa datos de contacto
   - Simula envío de solicitud

## Detalles Técnicos

### Cálculo de Precios
```javascript
Precio Final = (Precio Base + Adicionales) × Descuento Modalidad × Descuento Múltiple
```

### Descuentos por Modalidad
- Mensual: 0%
- Trimestral: -5%
- Semestral: -10%
- Anual: -15%

### Descuentos por Cantidad
- 1 servicio: 0%
- 2 servicios: -5%
- 3+ servicios: -10%

## Características del Código

### Buenas Prácticas Aplicadas
- Variables con nombres descriptivos
- Funciones con responsabilidad única
- Comentarios útiles (no excesivos pero necesarios para guiarme y moverme mas rapido en el codigo)
- Código asíncrono con async/await
- Manejo de errores con try/catch
- Event listeners organizados
- Responsive design

### JavaScript Features
- Template literals
- Arrow functions
- Array methods (forEach, map, filter, reduce)
- DOM manipulation
- Fetch API
- LocalStorage simulado con variables
- Event delegation

## Autor
Proyecto propio desarrollado para la entrega final del curso de JavaScript a su vez estoy diseñando una web para una empresa de seguridad privada ques de mi familia en la cual planeo usar a futuro este proyecto.