/// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const listaGastos = document.querySelector("#gastos");
//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}

//Clases

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(
     presupuesto);
    this.restante = Number(presupuesto);

    this.gastos = [];
  }

  nuevoGastos(gasto) {
    this.gastos = [...this.gastos, gasto];
  }

  calcularRestante() {}

  eliminarGasto(id){
      this.gastos= this.gastos.filter((gasto) => gasto.id != id)

  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;

   
  }

  imprimirAlerta(mensaje,tipo){

    const div = document.createElement('div');

    div.classList.add('text-center','alert');

    if(tipo === 'error'){
        div.classList.add('alert-danger')
    }else{
        div.classList.add('alert-success')
    }

    div.textContent=mensaje;


    document.querySelector('.primario').insertBefore(div,formulario);

    setTimeout(() =>{
        div.remove()
    },2000)
  }
}

//INSTANCIA
const ui = new UI();
let presupuesto;
//Funciones

function preguntarPresupuesto(e) {
    e.preventDefault();

  const presupuestoUsuario = prompt("De cuanto es tu presupuesto?");

  if (
    presupuestoUsuario === null ||
    presupuestoUsuario === "" ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);

  ui.insertarPresupuesto(presupuesto);
}


function agregarGasto(e){
    e.preventDefault();

    const nombre= document.querySelector("#gasto").value;
    const cantidad= document.querySelector("#cantidad").value;

    if(nombre === '' || cantidad === ''){
        
       ui.imprimirAlerta('Ambos campos son obligatorios','error');
       return;
    }

    if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no validad','error');
        return;
        
    }

    const gasto = {nombre, cantidad, id: Date.now()}

    presupuesto.nuevoGastos(gasto);

    ui.imprimirAlerta('Gasto agregado Correctamente.');
    console.log(presupuesto.gastos);

    
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

}