

import React from 'react';
import './Header.css';
import { Menu } from 'lucide-react'; 

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-content">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu />
        </button>
        <h2 className="project-name">Sistema de gestão - Amabilis Controle</h2>
      </div>
    </header>
  );
};

export default Header;
