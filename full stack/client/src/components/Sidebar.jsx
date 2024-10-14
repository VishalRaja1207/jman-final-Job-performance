import React from 'react';
import "../styles/sidebar.css"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const navigate = useNavigate();
    const handleLogOut = (e) => {
        localStorage.removeItem("token");
        toast.success("Logged out")
        navigate("/")
    }
  return (
    <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar">
        <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span class="fs-5 d-none d-sm-inline">JMAN</span>
            </a>
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 mt-4 align-items-center align-items-sm-start" id="menu">
                <li>
                    <a href="/dashboard" class="nav-link nav-link-color px-0 align-middle">
                    <i class="fs-5 bi bi-clipboard-pulse"></i> <span class=" fs-6 ms-1 d-none d-sm-inline li-style">Dashboard</span></a>
                </li>
                <li>
                    <a href="/scores" class="nav-link px-0 align-middle">
                    <i class="fs-5 bi bi-file-earmark-spreadsheet"></i> <span class="fs-6 ms-1 d-none d-sm-inline li-style">Scores</span></a>
                </li>
                <li>
                    <a href="/performance" class="nav-link px-0 align-middle">
                        <i class="fs-5 bi bi-speedometer"></i> <span class="fs-6 ms-1 d-none d-sm-inline li-style">Performance</span></a>
                </li>
                <li>
                    <a href="/add/course" class="nav-link px-0 align-middle">
                       <i class="fs-5 bi bi-book"></i> <span class="fs-6 ms-1 d-none d-sm-inline li-style">Add Training</span></a>
                </li>
            </ul>
            <hr />
            <div class="mt-5 pb-4">
                <button type="button" class="btn w-auto" style={{color: "White"}} onClick={(e) => handleLogOut(e)}>Logout<i className="ms-5 bi bi-arrow-bar-right"></i></button>
            </div>
        </div>
    </div>
  );
};
 
export default Sidebar;