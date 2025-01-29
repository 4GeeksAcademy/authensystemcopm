import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/authContext";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">My App</span>
                </Link>
                <div className="ml-auto">
                    {user ? (
                        <div className="d-flex align-items-center">
                            <span className="me-3">{user.email}</span>
                            <button 
                                className="btn btn-outline-primary me-2"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">
                                <button className="btn btn-outline-primary me-2">Login</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-primary">Sign Up</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};