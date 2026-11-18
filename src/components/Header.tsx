import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <NavLink to="/" className="brand" aria-label="ClaimLens home">
          <Logo size={38} />
          <span className="brand-text">
            <span className="brand-name">ClaimLens</span>
            <span className="brand-tagline">See through every claim.</span>
          </span>
        </NavLink>

        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
                New claim
              </NavLink>
            </li>
            <li>
              <NavLink to="/claims" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
                Approved claims
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
