import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState(""); // Set default role as employee
  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    console.log(mail + " " + pass + " " + role);
    
    axios.post("http://localhost:5000/api/v1/auth/login", {
      username: mail,
      password: pass,
      role: role // Send role to the backend
    }).then((response) => {
      localStorage.setItem("token", response.data.token);
      if(role === 'admin'){
        localStorage.setItem("role", "admin")
        navigate("/dashboard");
        toast.success("Logged in successfuly");
      }
      else {
        localStorage.setItem("role", "employee")
        navigate("/employee");
        toast.success("Logged in successfuly");
      }
    }).catch((e) => {
      navigate("/");
      toast.error("Invalid credentials")
      console.log(e);
    })
  }

  return (
    <div className='container-fluid'>
      <div className="container-fluid h-100 border border-light w-75 shadow-lg" style={{marginTop: "150px"}}>
        <div className="row h-100 align-items-center">
          <div className="col-12 col-md-8 d-none d-md-flex justify-content-center">
            <img
              src={require("../assets/inventory_image_register.jpg")}
              alt="Inventory"
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-md-4">
            <div className="container p-4">
              <form onSubmit={loginUser} className="row">
                <h2 className="mt-4 text-center">Sign in to your account</h2>
                <div className="mb-3 mt-3">
                  <label htmlFor="email-address" className="form-label">Username</label>
                  <input
                    type="text"
                    id="email-address"
                    name="email"
                    className="form-control"
                    placeholder="Username"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>
                {/* Role selection tabs */}
                <div className="mb-3 ms-5">
                  <div className='row'>
                      <div className='col-sm-6'>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="admin"
                            name="role"
                            value="admin"
                            className="form-check-input"
                            checked={role === "admin"}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            style={{cursor: "pointer"}}
                          />
                          <label htmlFor="admin" className="form-check-label">Admin</label>
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="employee"
                            name="role"
                            value="employee"
                            className="form-check-input"
                            checked={role === "employee"}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            style={{cursor: "pointer"}}
                          />
                          <label htmlFor="employee" className="form-check-label">Employee</label>
                        </div>
                      </div>
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn w-100 btn-primary" style={{backgroundColor: "#19105B", color: "#fff"}}>
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
