//Array para almacenar la transaccion
const transaccion = [];

const ordenarEstrellas = () => {
    peliculas.sort((a, b) => b.estrellas - a.estrellas)
    mostrarSeleccionOrden()
};

const ordenarDuracion = () => {
    peliculas.sort((a, b) => a.duracion - b.duracion)
    mostrarSeleccionOrden()
};

const mostrarSeleccionOrden = () => {
    const carteleraOrdenada = peliculas.map(pelicula => {
        return '*. '+ pelicula.nombre + ' || Duracion: '+ pelicula.duracion + ' Min | Estrellas: '+ pelicula.estrellas
    });
    console.log('Cartelera: \n\n' + carteleraOrdenada.join('\n'));
    comprarEntrada(carteleraOrdenada);
};

const comprarEntrada = (cartelera) => {
    let seleccionPelicula = '';
    let cantidadEntradas = 0;
    let seleccionCorrecta;
    let fechaCompleta = '';

    do {
        seleccionPelicula = prompt('¿Qué pelicula desea ver?:\n\n'+ cartelera.join('\n') + '\n\n[Ingrese el nombre completo de la pelicula]');

        if (seleccionPelicula === null || seleccionPelicula === '') {
            alert('La pelicula no se encuentra en la cartelera.\nIngrese un nombre correcto de pelicula');
            comprarEntrada(cartelera);
        }

        while (Number.isNaN(cantidadEntradas) || cantidadEntradas <= 0) {
            cantidadEntradas = parseInt(prompt('¿Cuántas entradas desea comprar?\n\nCada uno de los ascientos tienen un valor de $800'));

            if (Number.isNaN(cantidadEntradas) || cantidadEntradas <= 0) {
                alert('Debe ingresar una cantidad válida.');
            }
        }        

        const pelicula = peliculas.find(pelicula => pelicula.nombre.toLowerCase() === seleccionPelicula.toLowerCase().trim());
    
        console.log (pelicula);
        console.log (cantidadEntradas); 
    
        if (pelicula) {
            fechaCompleta = seleccionarFecha();
            console.log (fechaCompleta);
            agregarTransaccion(pelicula, cantidadEntradas, fechaCompleta);

            seleccionCorrecta = false;
        } else {
            alert('La pelicula no se encuentra en la cartelera. Ingrese un nombre correcto de pelicula');
            comprarEntrada(cartelera);
        }
    } while (seleccionCorrecta);

    confirmarTransaccion(seleccionPelicula);
};

const seleccionarFecha = () => {
    let fecha = '';
    let horario = 0;
    
    while (fecha === '' || horario === 0) {
        fecha = prompt("Por favor, ingrese una fecha:\n[Lunes | Martes | Miercoles | Jueves | Viernes | Sabado | Domingo]").toUpperCase();

        if (fecha === 'LUNES' || fecha === 'MARTES' || fecha === 'MIERCOLES' || fecha === 'JUEVES' || fecha === 'VIERNES' || fecha === 'SABADO' || fecha === 'DOMINGO'){
            while(!horario || horario <= 0) {
                horario = parseInt(prompt('Por favor, seleccione un horario:\n1. 16:00 hs\n2. 19:20 hs\n3. 22:40 hs'));
                
                switch (horario) {
                    case 1:
                        fecha = fecha + '. 16:00 hs';
                        return (fecha);
                        
                    case 2:
                        fecha = fecha + '. 19:20 hs';
                        return (fecha);

                    case 3:
                        fecha = fecha + '. 22:40 hs';
                        return (fecha);
                    
                    default:
                        alert('Debe seleccionar un horario válido.');
                        horario = 0;
                }
            }
        } else {
            alert('Debe ingresar una fecha válida.');
        }
    }
};

const agregarTransaccion = (pelicula, cantidad,fecha) => {
    pelicula.cantidad += cantidad;
    pelicula.fecha = fecha;
    
    transaccion.push(pelicula)
    console.log(transaccion)
};

const eliminarEntrada = (seleccionPelicula, cantidad) => {
    transaccion.forEach((pelicula, index) => {
        if (pelicula.nombre.toLowerCase() === seleccionPelicula.toLowerCase()) {
            if (cantidad > pelicula.cantidad) {
                transaccion.splice(index, 1);
            } else if (pelicula.cantidad > 1) {
                pelicula.cantidad -= cantidad;
            } else {
                transaccion.splice(index, 1);
        }
    }
    })   
    
    confirmarTransaccion(seleccionPelicula)
};

const confirmarTransaccion = (seleccionPelicula) => {
    let cantidadEliminar = 0;

    const informeTransaccion = transaccion.map(pelicula => {
        return pelicula.nombre  + '\nFecha: '+ pelicula.fecha + '\nCantidad Entradas: '+ pelicula.cantidad + '\nPrecio por Entrada: '+ pelicula.precio
    });

    if (informeTransaccion.length === 0) {
        alert ('Su transaccion se encuentra vacia. Inicie el proceso nuevamente.');
        bienvenida();
    } else {
        const confirmar = confirm('Checkout: '+'\n\n'+informeTransaccion.join('\n') +'\n\nSi esta correcto la transaccion, presione "Aceptar".\nSi desea eliminar alguna entrada, presione en "Cancelar"');
        
        console.log(transaccion)
        
        if (confirmar) {
            finalizarCompra(informeTransaccion);
        } else {
            do {
                cantidadEliminar = parseInt(prompt('Ingrese el numero de entradas a eliminar:'));
            }while (Number.isNaN(cantidadEliminar) || cantidadEliminar < 0);

            eliminarEntrada(seleccionPelicula, cantidadEliminar);
        }
    }
};

const finalizarCompra = (informe) => {
    const precioParcial = transaccion.reduce((acc, elemento) => acc + (elemento.precio * elemento.cantidad), 0);

    const precioTotal = verificarDescuento(precioParcial);

    alert('DATOS DE LA COMPRA\n==============================\n' + informe.join('\n') + '\n\nEl total de la compra es: $' + precioTotal);
};

const verificarDescuento = (precio) => {
    let precioDescuento = 0;
    let codigoDescuento = '';

    const fechaFlag = transaccion.some ((pelicula) => pelicula.fecha.includes('LUNES') || pelicula.fecha.includes('MIERCOLES') || pelicula.fecha.includes('VIERNES'));
    
    if (fechaFlag){
        alert('Usted ha seleccionado una fecha con descuento.\nSe aplicara un 15% de descuento.');
        precioDescuento = precio * 0.85;
    }

    codigoDescuento = prompt('Ingrese un codigo de descuento.\nSi no tiene uno, deje en sin completar esta opcion').toUpperCase();
    codigoDescuento = codigoDescuento.trim();

    if (codigoDescuento === 'CODER'){
        if (precioDescuento === 0){
            alert('Se ha ingresado el codigo de descuento ' + codigoDescuento + '\nSe aplicara un 50% de descuento.');
            precioDescuento = precio * 0.50;
        } else {
        alert('Se ha ingresado el codigo de descuento ' + codigoDescuento + '\nSe aplicara un 50% de descuento.');
        precioDescuento = precioDescuento * 0.50;
        }
    }

    return(precioDescuento);
};

const bienvenida = () => {

    const seleccionOrden = parseInt(prompt('Bienvenido al sistema de compra de entradas\n\n¿En que orden desea visualizar la cartelera?\n1: Ordenado por duracion [Menor a mayor]\n2: Ordenado por cantidad de estrellas [Mayor a menor]'));


    if (seleccionOrden === 1) {
        ordenarDuracion()
    } else if (seleccionOrden === 2) {
        ordenarEstrellas()
    } else {
        alert ('Ingrese un valor valido');
        bienvenida();
    }
};

bienvenida();