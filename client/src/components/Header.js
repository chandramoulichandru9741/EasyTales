import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css'; // Ensure this CSS file is present

const Header = () => {
    const [scrolling, setScrolling] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust the scroll threshold as needed
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {location.pathname !== '/stories' && (
                <div className="hero" style={{ backgroundImage: "url('/background.jpg')" }}></div>
            )}

            <nav className={`navbar navbar-expand-lg navbar-dark navbar-custom fixed-top ${scrolling ? 'scrolled' : ''}`}>
                <NavLink className="navbar-brand" to="/"><h1>EasyTales</h1></NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto p-3">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/stories">
                               My Stories
                            </NavLink>
                        </li>
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">
                                        Register
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Header;
