import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import HomePage from './components/HomePage';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/home" element={<HomePage />} />

            </Routes>
        </Router>
    );
};

export default App;
