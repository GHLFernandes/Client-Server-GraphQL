import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/Sign-in';

export default function Rota(){
    return(
        <Routes>
            <Route path='/' exact element={ <Home /> } />
            <Route path='/sign-in' exact element={ <SignIn /> } />
        </Routes>
    )
}