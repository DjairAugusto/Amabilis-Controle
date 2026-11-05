import React from "react";
import NavbarItem from "../../ui/NavbarItem";
import "./Navbar.css";

import {
  LayoutDashboard,
  Building2,
  FileText,
  Package,
  BarChart3,
  ListTree,
  Truck,
  HardHat,
  AlignVerticalJustifyEnd,
  HandCoins,
  Map,
  BookOpen,
} from "lucide-react";

const navItems = [
  {
    icon: <LayoutDashboard />,
    text: "Dashboard",
    path: "/",
  },
  {
    icon: <Building2 />,
    text: "Obras",
    path: "/obras",
  },
  {
    icon: <HandCoins />,
    text: "Pagamentos",
    path: "/pagamentos",
  },
  {
    icon: <ListTree />,
    text: "Tarefas",
    path: "/tarefas",
  },
  {
    icon: <BarChart3 />,
    text: "Relatórios",
    path: "/relatorios",
  },
  {
    icon: <Truck />,
    text: "Fornecedores",
    path: "/fornecedores",
  },
  {
    icon: <AlignVerticalJustifyEnd />,
    text: "Recursos",
    path: "/recursos",
  },
  {
    icon: <Map />,
    text: "Mapa",
    path: "/mapa",
  },
  {
    icon: <BookOpen />,
    text: "Tutorial",
    path: "/tutorial",
  },
];

const Navbar = ({ collapsed }) => {
  return (
    <nav className={`navbar ${collapsed ? "collapsed" : ""}`}>
      <div className="navbar-header">
        <div className="logo">
          <HardHat size={32} />
        </div>
        {!collapsed && <h2 className="title">Amabilis Controle</h2>}
      </div>
      <div className="nav-menu-label">{!collapsed ? "Menu" : ""}</div>
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            icon={item.icon}
            text={item.text}
            path={item.path}
            collapsed={collapsed}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
