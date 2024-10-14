import axios from 'axios';
import React from 'react'
import { useState, useEffect } from "react";
import Barchart from '../../charts/Barchart';
import Gaugechart from '../../charts/Gaugechart';
import { getEmplyeesByDesignation } from '../../services/services';

const Performance = () => {
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [performanceData, setPerformanceData] = useState("");
  const [retentionData, setRetentionData] = useState("");
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("Software Engineer");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(1);
  const [gaugeData, setGaugeData] = useState(0);
  // Fetch designations and set the initial employee and data
  useEffect(() => {
    fetchDesignations();
  }, []);

  // Fetch employees when designation changes
  useEffect(() => {
    fetchEmployees();
  }, [selectedDesignation]);

  // Fetch data when selected employee changes
  useEffect(() => {
    if (selectedEmployee) {
      fetchPerformanceData(selectedEmployee);
      fetchTableData(selectedEmployee);
      fetchRetentionData(selectedEmployee);
      fetchPieData(selectedEmployee);
      fetchGaugeData(selectedEmployee)
    }
  }, [selectedEmployee]);

  // Fetch designations from API or mock data
  const fetchDesignations = async () => {
    const data = [
      { designation: "Software Engineer" },
      { designation: "Project Manager" },
      { designation: "HR Manager" },
      { designation: "Data Analyst" },
      { designation: "IT Specialist" },
    ];
    setDesignations(data);
    setSelectedDesignation(data[0].designation); // Set the first designation as default
  };

  // Fetch employees based on the selected designation
  const fetchEmployees = async () => {
    try {
      const response = await getEmplyeesByDesignation(selectedDesignation);
      const data = response.data;
      setEmployees(data);
      setSelectedEmployee(data[0]?.id || "N/A"); // Set the first employee as default or null if no employees
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch performance data for the selected employee
  const fetchPerformanceData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/admin/cummulative?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data;
      setPerformanceData(data[0]?.Percentage || "N/A");
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  // Fetch table data (learning history) for the selected employee
  const fetchTableData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/admin/history?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data;
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Fetch retention data for the selected employee
  const fetchRetentionData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/admin/retention?empId=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data;
      setRetentionData(data[0].retention);
    } catch (error) {
      console.error("Error fetching retention data:", error);
    }
  };

  // Fetch bar chart data (scores by training) for the selected employee
  const fetchPieData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/admin/training-emp-scores?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data;
      setBarData(data);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  const fetchGaugeData = async(id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/admin/successrate?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data;
      setGaugeData(data.cumulative_success_rate)
      
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  }

  // Handle designation change
  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
  };

  // Handle employee change
  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  return (
    <div className="container">
      <h2 className="my-4">PERFORMANCE ANALYSIS</h2>
      <div className='row'>
        <div className="col-lg-6 mt-3">
          <label htmlFor="designationDropdown" className="form-label">
            Filter by Designation
          </label>
          <select
            className="form-select"
            id="designationDropdown"
            value={selectedDesignation}
            onChange={handleDesignationChange}
          >
            {designations.map((designation, index) => (
              <option key={index} value={designation.designation}>
                {designation.designation}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-6 mt-3">
          <label htmlFor="employeeDropdown" className="form-label">
            Filter By Employees
          </label>
          <select
            className="form-select"
            id="employeeDropdown"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Performance and Retention display */}
      <div className="row mt-5">
        <div className="col text-end" > 
          <div className="card item-card custom-card w-auto">
            <div className="card-body">
              <div className="row">
                <div
                  className="col-md-6 custom-col text-center"
                  style={{ borderRight: "4px solid #19105B" }}
                >
                  <p>Performance</p>
                  <b>
                    <p style={{fontSize: "1.5rem"}}>
                      <span>{performanceData}</span>
                    </p>
                  </b>
                </div>
                <div
                  className="col-md-6 custom-col text-center"
                  style={{ borderRight: "4px solid #FF6196" }}
                >
                  <p>Retention</p>
                  <b>
                    <p style={{fontSize: "1.5rem"}}>
                      <span>{retentionData ? "Yes" : "No"}</span>
                    </p>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='col'>
          ksjdfhkj
        </div> */}
      </div>

      {/* Bar chart and learning history table */}
      <div className='row mt-5'>
        <div className='col-lg-6'>
          <div className="card item-card custom-card w-max">
            <Barchart header="Scores by training" data={barData} />
          </div>
        </div>
        <div className='col-lg-6'>
          <div className="card item-card custom-card">
            {/* <div className='card-header'>
              <h6 style={{textAlign: "center"}}><b>Learning History</b></h6>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Training</th>
                  <th>Score</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((data) => (
                    <tr key={data.id}>
                      <td>{data.training_name}</td>
                      <td>{data.score}</td>
                      <td>{data.start_date}</td>
                      <td>{data.end_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table> */}
            <Gaugechart data = {gaugeData}></Gaugechart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
