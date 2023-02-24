/* eslint-disable arrow-body-style */
const nombreCache = 'CCAPP-v2';
const assets = [
  './',
  './index.html',
  './error.html',
  './js/main.js',
  './css/app.css',
  './css/normalize.css',
  './css/skeleton.css',
  './img/cryptomonedas.png',
];

// Cuando se instala el Service Worker
self.addEventListener('install', (e) => {
  console.log('Instalado el Service Worker');

  e.waitUntil(
    // Buen lugar para cachear -
    caches.open(nombreCache).then((cache) => {
      // Esta función es asincrona...
      console.log('cacheando...');
      cache.addAll(assets);
    })
  );

  // Revisar en App (Chrome) en Firefox en Almacenamiento
});

// Activar el service worker...
self.addEventListener('activate', (e) => {
  console.log('Service Worker Activado');

  // Actualizar la PWA //
  e.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys);

      return Promise.all(
        keys
          .filter((key) => key !== nombreCache)
          .map((key) => caches.delete(key)) // borrar los demas
      );
    })
  );
});

// Fetch events para el CSS, HTML, imagenes JS, y hasta llamados a fetch..
self.addEventListener('fetch', (e) => {
  console.log('Fetch.. ', e);

  e.respondWith(
    caches
      .match(e.request)
      .then((respuestaCache) => {
        return respuestaCache || fetch(e.request);
      })
      .catch(() => caches.match('./error.html')) // colocar puntoen la ruta, por eso no funcionaba
  );
});
