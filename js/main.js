if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then((registrado) =>
      console.log('Registered service worker correctly', registrado)
    )
    .catch((error) => console.log('Failed to register service worker', error));
} else {
  console.log('No support for service worker');
}
