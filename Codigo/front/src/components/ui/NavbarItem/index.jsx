import { NavLink } from 'react-router-dom'
import './NavbarItem.css'

const NavbarItem = ({ icon, text, path, collapsed }) => {
    return (
        <li className="nav-item">
            <NavLink to={path} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-icon">{icon}</span>
                {!collapsed && <span className="nav-text">{text}</span>}
            </NavLink>
        </li>
    )
}

export default NavbarItem