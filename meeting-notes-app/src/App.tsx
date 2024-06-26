import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Notes from './pages/Notes';

function App() {
  return (
    <BrowserRouter> {  }
      <Routes>
        {/* Route to main note page */}
        <Route path="/" element={<Notes />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
