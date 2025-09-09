// import React, { useEffect, useState } from 'react';

// const Notifications = () => {
//   // 1. Cambiar el estado para que sea un arreglo vacío
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const eventSource = new EventSource('http://localhost:3000/api/notifications/sse');

//     eventSource.onmessage = (event) => {
//       console.log('Mensaje recibido:', event.data);
//       try {
//         const parsedData = JSON.parse(event.data);
        
//         // 2. Usar una función de actualización para agregar el nuevo mensaje al arreglo
//         setNotifications((prevNotifications) => [
//           ...prevNotifications,
//           parsedData,
//         ]);
//       } catch (error) {
//         console.error('Error al parsear el JSON:', error);
//       }
//     };

//     eventSource.onerror = (error) => {
//       console.error('EventSource falló:', error);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return (
//     <div>
//       {/* 3. Renderizar la lista de notificaciones */}
//       {notifications.length > 0 ? (
//         <ul>
//           {notifications.map((notif, index) => (
//             <li key={index}>
//               <pre>{JSON.stringify(notif, null, 2)}</pre>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Esperando datos del servidor...</p>
//       )}
//     </div>
//   );
// };

// export default Notifications;