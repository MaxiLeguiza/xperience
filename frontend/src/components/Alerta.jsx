import React from 'react'

const Alerta = ({alerta}) => {
  
  // Si es error: Fondo blanco y texto rojo claro (text-red-500)
  const errorClases = 'bg-white border border-red-400 text-red-500'; 
  
  // Si es éxito: Fondo blanco y texto verde (text-green-600)
  const exitoClases = 'bg-white border border-green-500 text-green-600'; 

  // La clase a aplicar se elige según la prop 'error'
  const clasesDeColor = alerta.error ? errorClases : exitoClases;

  return (
    <div 
      className={`
        ${clasesDeColor}
        text-center 
        p-3 
        rounded-xl 
        uppercase 
        font-bold 
        text-sm 
        my-10
      `}
    >
      {alerta.msg}
    </div>
  )
}

export default Alerta