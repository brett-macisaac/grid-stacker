import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
    <App />
);

/*
* Configure automatic page reload.
* Without this, the app will use the old code/assets, rather than reloading the app with the newly received data from 
  the server.
* See documentation for more details: https://vite-pwa-org.netlify.app/guide/auto-update.html.
*/
if ("serviceWorker" in navigator) 
{
    registerSW({ immediate: true });
}
// Register the service worker (allows for offline use).
// if ("serviceWorker" in navigator) 
// {
//     window.addEventListener(
//         'load', 
//         () => 
//         {
//             console.log("Registering!");
//             navigator.serviceWorker.register("/sw.js");
//         }
//     )
// }