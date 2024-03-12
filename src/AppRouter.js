// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/ResumeMatch';


export const routes = [
  { path: '/', name: 'Wells Fargo Hackathon Challenge : Resume Best Match', component: <Home /> },
  
];

const AppRouter = () => {
  return (
    <Router>
      <Navbar />

      <div className='container'>
        <Routes>

          {
            routes.map((route) => {
              return (
                <Route path={route.path} exact element={route.component} />
              );
            })
          }
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;