import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authContext";

export const Private = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>Welcome to your Dashboard</h2>
                    <p className="lead">You are logged in as: {user.email}</p>
                </div>
            </div>
        </div>
    );
};