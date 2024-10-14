import React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();
export const Authentication = (props) => {
    const [mail, setMail] = useState("");
    const navigate = useNavigate();
    const login = (mail) => {
        setMail(mail);
    }

    const logout = () => {
        console.log("Inside");
        
        setMail("");
        localStorage.removeItem("token");
        localStorage.removeItem("mail");
        navigate("/login")
    }

    return (
        <AuthContext.Provider value = {{mail, login, logout}}>
            {props.children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext);
}



