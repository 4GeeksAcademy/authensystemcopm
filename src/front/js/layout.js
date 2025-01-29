import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Private } from "./pages/private";
import { AuthProvider } from "./store/authContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <AuthProvider>
                    <ScrollToTop>
                        <Navbar />
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={<Demo />} path="/demo" />
                            <Route element={<Single />} path="/single/:theid" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<Private />} path="/private" />
                            <Route element={<h1>Not found!</h1>} path="*" />
                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

export default Layout;