import React from "react";
// import toast from 'react-hot-toast';
import { Navigate } from "react-router-dom";
export const RequiredAuth = (props) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if(!token) {
        return <Navigate to="/"></Navigate>
    }

    if(role != props.role) {
        return <Navigate to="/"></Navigate>
    }
    
    return props.children;
}