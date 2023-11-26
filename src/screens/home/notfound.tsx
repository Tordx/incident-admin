import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

export default function NotFound({}: Props) {
    const navigate = useNavigate()
  return (
    <div className='container'>
        <h1>You are nowhere</h1>
        <button onClick={() => navigate('/')}>Home</button>
    </div>
  )
}