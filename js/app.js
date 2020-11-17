/// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const listaGastos = document.querySelector("#gastos");
//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
  // listaGastos.addEventListener('click', (e)=>{
  //   if(e.target.classList.contains('borrar-gasto')){
  //     id=e.target.parentElement.getAttribute('data-id');
  //     eliminarGasto(id);
  //   }
  // })
}

//Clases

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);

    this.gastos = [];
  }

  nuevoGastos(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );

    this.restante = this.presupuesto - gastado;
    console.log(this.restante);
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
    console.log(this.gastos);
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const div = document.createElement("div");

    div.classList.add("text-center", "alert");

    if (tipo === "error") {
      div.classList.add("alert-danger");
    } else {
      div.classList.add("alert-success");
    }

    div.textContent = mensaje;

    document.querySelector(".primario").insertBefore(div, formulario);

    setTimeout(() => {
      div.remove();
    }, 2000);
  }

  agregarGastoListado(gastos) {
    this.limpiarListadoGasto();

    // for (const gasto of gastos) {

    //  li.innerHTML = `
    // ${gasto.nombre}

    // <span class="badge badge-primary badge-pill">$ ${gasto.cantidad}</span>
    // <button class="btn btn-danger borrar-gasto">Borrar X</button>
    //  `;
    // listaGastos.appendChild(li)
    // }

    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;
      const nuevoGasto = document.createElement("li");

      nuevoGasto.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      nuevoGasto.dataset.id = id;
      nuevoGasto.innerHTML = `
      ${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span> 
       `;

      //Boton para borrar el gastos
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);
      listaGastos.appendChild(nuevoGasto);
    });
  }

  //Actualizar el restante
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const divRestante = document.querySelector(".restante");
    //Comprobar 25 %

    if (presupuesto / 4 > restante) {
      console.log("Ya gastaste el 75 %");

      divRestante.classList.remove("alert-success", "alert-warning");
      divRestante.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      console.log("Ya Gastaste el 50 %");

      divRestante.classList.remove("aler-success");
      divRestante.classList.add("alert-warning");
    } else {
      divRestante.classList.remove("alert-danger", "alert-warning");
      divRestante.classList.add("alert-success");
    }

    //Si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");

      formulario.querySelector('button[type="submit"]').disabled = true;
    } else if (restante >= 0) {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }

  //LimpiarHtml

  limpiarListadoGasto() {
    while (listaGastos.firstChild) {
      listaGastos.removeChild(listaGastos.firstChild);
    }
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

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  }

  if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no validad", "error");
    return;
  }

  const gasto = { nombre, cantidad, id: Date.now() };

  presupuesto.nuevoGastos(gasto);

  ui.imprimirAlerta("Gasto agregado Correctamente.", "exito");

  //Impirmir los gastos

  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  formulario.reset();
}

function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);

  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
