import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import Scores from './pages/Admin/Scores';
import Performance from './pages/Admin/Performance';
import Course from './pages/Admin/Course';
import Login from './pages/Login';
import { RequiredAuth } from './utils/RequiredAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Employee from './pages/Employee/Employee';
import EmpSidebar from './components/EmpSidebar';
import Feedback from './pages/Employee/Feedback';
import  { Toaster } from 'react-hot-toast';

function Layout() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar /> {/* Fixed Sidebar */}
        <div className="col content-container">
          <Outlet /> {/* Outlet to render the main content */}
        </div>
      </div>
    </div>
  );
}

function EmpLayout() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <EmpSidebar></EmpSidebar> {/* Fixed Sidebar */}
        <div className="col content-container">
          <Outlet /> {/* Outlet to render the main content */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<EmpLayout />}>
          <Route path = "/employee" element = {<RequiredAuth role = "employee"><Employee /></RequiredAuth>} />
          <Route path='/employee/feedback' element = {<RequiredAuth role = "employee"><Feedback /></RequiredAuth>} />
        </Route>
        <Route element={<Layout />}> {/* Use Layout to apply Sidebar */}
          <Route path="/dashboard" element={<RequiredAuth role = "admin"><Dashboard /></RequiredAuth>} />
          <Route path="/scores" element={<RequiredAuth role = "admin"><Scores /></RequiredAuth>} />
          <Route path="/performance" element={<RequiredAuth role = "admin"><Performance /></RequiredAuth>} />
          <Route path="/add/course" element={<RequiredAuth role = "admin"><Course /></RequiredAuth>} />
        </Route>
      </Routes>
      <Toaster position='top-center'/>
    </BrowserRouter>
  );
}

export default App;
