import React, { useEffect, useState } from "react";
import Barchart from "../../charts/Barchart";
import Piechart from "../../charts/Piechart";

import {
  getDashBarData,
  getDashPieData,
  getDashTableData,
  getRetentionData,
  getEmployeeCount
} from "../../services/services";
import Donutchart from "../../charts/Donutchart";

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [topPerformer, setTopPerformer] = useState("");
  const [topCourse, setTopCourse] = useState("");
  const [retentionData, setRetentionData] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  useEffect(() => {
    fetchTableData();
    fetchBarData();
    fetchPieData();
    fetchRetentionData();
    fetchEmployeeCount();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await getDashTableData();
      const data = response.data;
      setTableData(data);
      setTopPerformer(data[0].Name);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBarData = async () => {
    try {
      const response = await getDashBarData();
      const data = response.data;
      setBarData(data);
      setTopCourse(data[0].Name);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPieData = async () => {
    try {
      const response = await getDashPieData();
      const data = response.data;
      setPieData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRetentionData = async () => {
    try {
      const response = await getRetentionData();
      const data = response.data["data"];
      setRetentionData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      const response = await getEmployeeCount();
      const data = response.data["count"]
      console.log(data);
      setEmployeeCount(data);
      
    } catch (error) {
      
    }
  }

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col text-end">
          <div className="card item-card custom-card w-auto">
            <div
              className="card-header"
              style={{ backgroundColor: "#19105B", color: "#fff" }}
            >
              <h5 className="mb-0">Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #19105B" }}
                >
                  <p>Top Performer</p>
                  <b>
                    <p>
                      <span>{topPerformer}</span>
                    </p>
                  </b>
                </div>
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #FF6196" }}
                >
                  <p>Top Course</p>
                  <b>
                    <p>
                      <span>{topCourse}</span>
                    </p>
                  </b>
                </div>
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #71EAE1" }}
                >
                  <p>Employees</p>
                  <b>
                    <p>
                      <span>{employeeCount}</span>
                    </p>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="row mt-3">
            <div className="col-lg-6">
              <div className="card item-card custom-card">
                <div className="card-header">
                  <h6 style={{ textAlign: "center" }}>
                    <b>Training Cummulative Scores</b>
                  </h6>
                </div>
                <Barchart header="" data={barData}></Barchart>
              </div>
              <div className=""></div>
            </div>
            <div className="col-lg-6">
              <div className="card item-card custom-card">
                <div className="card-header">
                  <h6 style={{ textAlign: "center" }}>
                    <b>Employee cummulative scores</b>
                  </h6>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Percentage</th>
                      <th>No of trainings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.Name}</td>
                        <td>{emp.Designation}</td>
                        <td>{emp.Percentage}</td>
                        <td>{emp["Total Trainings"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mt-3">
              <div className="card item-card custom-card">
              <div className="card-header">
                  <h6 style={{ textAlign: "center" }}>
                    <b>Designation Pass Percentage</b>
                  </h6>
                </div>
                <Donutchart header="Scores by training" data={pieData}></Donutchart>
              </div>
            </div>
            <div className="col-lg-6 mt-3">
              <div className="card item-card custom-card">
              <div className="card-header">
                  <h6 style={{ textAlign: "center" }}>
                    <b>Employee Retention Percentage</b>
                  </h6>
                </div>
                <Piechart header="Scores by training" data={[{categories: "Retention", series: retentionData}, {categories: "No Retention", series: 100 - Number(retentionData)}]}></Piechart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
