import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

interface Props {
    onLogout: () => void
}

const DashboardLayout: React.FC<Props> = ({ onLogout}) => {
  return (
      <div className='flex h-screen bg-gray-50'>
          <Sidebar onLogout={onLogout} />

          <div className='flex-1 p-6 overflow-auto'>
              <Outlet />
          </div>
    </div>
  )
}

export default DashboardLayout