require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquireMenu,
    pausa, 
    leerInput,
    listadoTareaBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

console.clear();

const main = async () => {


    const tareas = new Tareas();

    let opt = '';

    const tareasDB = leerDB();

    if ( tareasDB ) {
        
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {

        opt = await inquireMenu();
        // console.log({ opt })

        switch (opt) {
            case '1':
               const desc = await leerInput('Descripción:');
               tareas.crearTarea(desc);

            break;
            
            case '2':
                tareas.listadoCompleto();
                break;
            
            case '3':
                tareas.listarPendientesCompletadas( true );
                break;

            case '4':
                tareas.listarPendientesCompletadas( false );
                break;

            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;
            
            case '6':
                const id = await listadoTareaBorrar( tareas.listadoArr );
                
                if ( id !== '0' ){
                    
                    const ok = await confirmar('¿Estás seguro?');
                    if ( ok ){
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
                break;
        }


        guardarDB( tareas.listadoArr );

        
        await pausa();

    } while( opt !== '0' );

}

main();