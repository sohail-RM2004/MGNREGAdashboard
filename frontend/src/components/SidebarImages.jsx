import React from 'react';
import './SidebarImages.css';

export default function SidebarImages() {
  return (
    <>
      <div className="sidebar-image left-sidebar">
        <img src="/images/leftsidebar.jpg" alt="MGNREGA Workers" />
      </div>
      <div className="sidebar-image right-sidebar">
        <img src="/images/rightsidebar.png" alt="Rural Development" />
      </div>
    </>
  );
}