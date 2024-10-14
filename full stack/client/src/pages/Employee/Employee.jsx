import React, { useEffect, useState } from "react";
import { getEmployeeCard, getEmployeeFailData, getEmployeePassData } from "../../services/services";

const Employee = () => {
  const [card, setCard] = useState({});
  const [passTable, setPassTable] = useState([]);
  const [failTable, setFailTable] = useState([]);

  useEffect(() => {
    getCardDetails();
    getPassTableData();
    getFailTableData();
  }, []);

  const getCardDetails = async () => {
    try {
      const results = await getEmployeeCard();
      const data = results.data || {}; // Ensure `data` is always an object
      setCard({
        total_courses_attended: data.total_courses_attended || 0, // Default to 0 if undefined
        total_courses_passed: data.total_courses_passed || 0,     // Default to 0 if undefined
      });
      setCard(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPassTableData = async () => {
    try {
      const results = await getEmployeePassData();
      const data = results.data;
      setPassTable(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFailTableData = async () => {
    try {
      const results = await getEmployeeFailData();
      const data = results.data;
      setFailTable(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      {/* Card section */}
      <div className="row mt-3">
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
                {/* No of Courses */}
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #19105B" }}
                >
                  <p>No of Courses</p>
                  <b>
                    <p>
                      <span>
                        {card.total_courses_attended !== undefined
                          ? card.total_courses_attended
                          : "No data available"}
                      </span>
                    </p>
                  </b>
                </div>

                {/* Pass */}
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #FF6196" }}
                >
                  <p>Pass</p>
                  <b>
                    <p>
                      <span>
                        {card.total_courses_passed !== undefined
                          ? card.total_courses_passed
                          : "No data available"}
                      </span>
                    </p>
                  </b>
                </div>

                {/* Fail */}
                <div
                  className="col-md-4 custom-col text-center"
                  style={{ borderRight: "4px solid #FF6196" }}
                >
                  <p>Fail</p>
                  <b>
                    <p>
                      <span>
                        {card.total_courses_attended !== undefined && card.total_courses_passed !== undefined
                          ? card.total_courses_attended - card.total_courses_passed
                          : "No data available"}
                      </span>
                    </p>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pass Table Section */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card item-card custom-card">
            <div className="card-header" style={{backgroundColor: "#19105B", color: "#fff"}}>
              <h6 style={{ textAlign: "center" }}>
                <b>Skills Learned</b>
              </h6>
            </div>
            {passTable.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Skills</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {passTable.map((data) => (
                    <tr key={data["Training Name"]}>
                      <td>{data["Training Name"]}</td>
                      <td>{data["start_date"]}</td>
                      <td>{data["end_date"]}</td>
                      <td>{data.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No skills learned yet</p>
            )}
          </div>
        </div>

        {/* Fail Table Section */}
        <div className="col-md-6">
          <div className="card item-card custom-card">
            <div className="card-header" style={{backgroundColor: "#19105B", color: "#fff"}}>
              <h6 style={{ textAlign: "center" }}>
                <b>Need to Improve</b>
              </h6>
            </div>
            {failTable.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Skills</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {failTable.map((data) => (
                    <tr key={data["Training Name"]}>
                      <td>{data["Training Name"]}</td>
                      <td>{data["start_date"]}</td>
                      <td>{data["end_date"]}</td>
                      <td>{data.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No courses failed yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
