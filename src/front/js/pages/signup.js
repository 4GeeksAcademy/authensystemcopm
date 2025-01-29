import React, { useState } from "react";
import { useAuth } from "../store/authContext";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
        } catch (err) {
            setError(err.message || "Signup failed");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};