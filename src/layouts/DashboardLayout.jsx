import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './../Components/Sidebar';
// import TopBar from './../Components/TopBar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100" dir="ltr">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <TopBar  sidebarOpen={sidebarOpen} /> */}
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;