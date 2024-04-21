// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, Route, redirect } from 'react-router-dom';
import { isLoggedIn } from '../../../helpers/auth';

const PrivateRoute = () => {    
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
