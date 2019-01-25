import React, { Component } from 'react';
import './Navbar.css';

import {Link} from 'react-router-dom';

const Navbar = (props) => {
    const _main = props._main;
    const isSideMenuShown = _main.state.appControls.isSideMenuShown;
    const isLoggedIn = _main.state.user.isLoggedIn;

    return (
        <div className="Navbar">
        
            <Link className="logo" to="/">SmartKitchen</Link>
            
            <button className="hamburger-menu" onClick={_main.toggleSideMenu}>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
            </button>
            
            <div className={"overlay" + (isSideMenuShown ? " shown" : "")}
                onClick={_main.toggleSideMenu}></div>
            
            <div className={"side-menu" + (isSideMenuShown ? " shown" : "")}>
                <button className="cross-icon" onClick={_main.toggleSideMenu}>
                    <span className="cross-bar"></span>
                    <span className="cross-bar"></span>
                </button>

                <ul>
                    {isLoggedIn 
                    ? (<>
                        <li>
                            <Link className="menu-link" to="/dashboard" 
                                onClick={_main.toggleSideMenu}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link className="menu-link" to="/myprofile" 
                                onClick={_main.toggleSideMenu}
                            >
                                My Profile
                            </Link>
                        </li>
                    </>)
                    : (<>
                        <li>
                            <Link className="menu-link" to="/login"
                                onClick={_main.toggleSideMenu}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link className="menu-link" to="/signup"
                                onClick={_main.toggleSideMenu}
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>)
                    }
                    
                    <hr />
                    <li>
                        <Link className="menu-link" to="/about" 
                            onClick={_main.toggleSideMenu}
                        >
                            About
                        </Link>
                    </li>
                    {isLoggedIn
                    ? <li>
                        <Link className="menu-link" to="/logout" 
                            onClick={_main.logoutUser}
                        >
                            Logout
                        </Link>
                    </li>
                    : null}
                </ul>
            </div>
        </div>
    )
}

export default Navbar;
