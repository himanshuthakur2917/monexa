"use client"

import { useAuth } from '@/context/AuthProvider'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const {logout} = useAuth()

  const handleLogOut = async () => { 
    await axios.post('/api/auth/logout').then((response) => { console.log(response.data) 
      if (response.status === 200) {
        logout()
        router.push('/login')
      }
     })
   }

  return (
    <div className='w-screen h-screen'>
     <div className='relative h-full flex justify-center items-center'>
       <button onClick={handleLogOut} className='w-[10rem] h-[3rem] mx-auto border border-red-500 bg-white text-black' >Log Out</button>
     </div>
    </div>
  )
}

export default Page
