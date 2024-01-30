// src/components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import Styles
import logo from'../images/logo.png'; // Import your logo

const NavBar = () => {
    return (
        <nav>
                <img src={logo} alt="Logo" className="logo" />
            <ul>
                <li>
                    <a><Link to="/">Home</Link></a>
                </li>
                <li>
                <a><Link to="/charts">Visualisation</Link></a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
