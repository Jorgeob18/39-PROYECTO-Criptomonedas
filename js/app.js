/* eslint-disable no-useless-return */
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: '',
};

// Crear promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

  formulario.addEventListener('submit', submitFormulario);

  criptomonedasSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
  const url =
    'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((crypto) => {
    const { FullName, Name } = crypto.CoinInfo;

    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  // console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  // validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === '' || criptomoneda === '') {
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }

  // Consultar la API con los resultados
  consultarAPI();
}

function mostrarAlerta(msg) {
  const existeError = document.querySelector('.error');
  if (!existeError) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    // Mensaje de error
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 2500);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();

  setTimeout(() => {
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((cotizacion) => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
      });
  }, 1500);
}

function mostrarCotizacionHTML(cotizacion) {
  // console.log(cotizacion);

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `<p> Precio mas alto del dia es: <span>${HIGHDAY}</span></p>`;

  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `<p> El precio mas bajo del dia es: <span>${LOWDAY} </span></p>`;

  const ultimasHoras = document.createElement('p');
  ultimasHoras.innerHTML = `<p>Variacion de las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement('p');
  ultimaActualizacion.innerHTML = `<p>Ultima Actualización: <span>${LASTUPDATE}</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  const spinner = document.createElement('div');
  spinner.classList.add('sk-cube-grid');
  spinner.innerHTML = `
    <div class="sk-cube-grid">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
  `;
  resultado.appendChild(spinner);
}
