import React from 'react'

const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-blue-700 to-blue-900'}
     bg-gradient-to-r text-center p-3 rounded-xl text-white uppercase font-bold text-sm mb-10`}>
        {alerta.msg}
    </div>
  )
}

export default Alerta