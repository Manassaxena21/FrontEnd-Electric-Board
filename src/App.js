// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePageGrid from './components/HomePageGrid'; // Import from Home page
import ChartsPage from './components/ChartsPage'; // Import for Charts File
import './App.css'; // Import the CSS file


const App = () => {
    // Mock data (replace with actual data from your backend)
    const data = [
        // Sample data
    ];

    return (
        <Router>
            <div>
            <NavBar />
            <Routes>
                    <Route path="/" element={<HomePageGrid />} />
                    <Route path="/charts" element={<ChartsPage />} /> 
            </Routes>
            </div>
        </Router>
    );
};

export default App;
