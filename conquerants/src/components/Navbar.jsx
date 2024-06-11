import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import logo from '../images/logo.png';
import "../styles/Navbar.css";

function Navbar({ connecter, admin, handleLangue, langue, langues }) {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
            <Link className="logo" to="/"><img src={logo} alt="logo" /></Link>
            <div>
                <ul id="navBar" className={menuOpen ? "open" : ""}>
                    <li className="item">
                        <DropdownButton className="equipes" title={langue.navbar.equipes}>
                            <NavLink className="item" to="/equipes/valo">VALORANT</NavLink>
                            <NavLink className="item" to="/equipes/lol">LEAGUE OF LEGENDS</NavLink>
                            <NavLink className="item" to="/equipes/rl">ROCKET LEAGUE</NavLink>
                        </DropdownButton>
                    </li>
                    <li className='item'><NavLink to="/joueurs">{langue.navbar.joueurs}</NavLink></li>
                    <li className='item'><NavLink to="/matchs/">{langue.navbar.matchs}</NavLink></li>
                    {!admin && connecter && <li className='item'><NavLink to="/predictions">{langue.navbar.predictions}</NavLink></li>}
                    {admin && connecter && <li className="item">
                        <DropdownButton className="administration" title={langue.navbar.admin}>
                            <NavLink className="item" to="/ajoutModifEquipe/">{langue.navbar.equipe}</NavLink>
                            <NavLink className="item" to="/ajoutModifJoueur/">{langue.navbar.joueur}</NavLink>
                            <NavLink className="item" to="/ajoutModifMatch/">{langue.navbar.match}</NavLink>
                            <NavLink className="item" to="/ajoutPartie/">{langue.navbar.partie}</NavLink>
                        </DropdownButton>
                    </li>}
                    <li className='itemProfil'><NavLink className="profil" to={connecter ? "/profil/" : "/connexion"}><i className="fa-solid fa-user"></i></NavLink></li>
                </ul>
            </div>
            <div id="mobile">
                <i id="bar" className={menuOpen ? "fas fa-times mobileMenu" : "fas fa-bars mobileMenu"} onClick={() => setMenuOpen(!menuOpen)}></i>
            </div>

            <Dropdown onSelect={handleLangue} className="langue">
                <Dropdown.Toggle>
                    <i className="fas fa-globe"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {langues.map((lang, index) => {
                        return <Dropdown.Item key={index} className="item" eventKey={lang.key}>{lang.langue}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </nav>
    );
}

export default Navbar;