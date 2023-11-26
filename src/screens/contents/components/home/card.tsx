import React from 'react'
import { Children } from 'types/interfaces'


export default function Cards({children}: Children) {
  return (
    <div className='card-container'>
        <div>
            {children}
        </div>
    </div>
  )
}