import React from "react";
import { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import "../../styles/sidebar.css";
import {
  createTraining,
  deleteTraining,
  getTrainerFeedback,
  getTraining,
  updateTraining,
} from "../../services/services";
import toast from "react-hot-toast";
import "../../styles/page.css";

const Course = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Rows per page can be set here
  const [updateCard, setUpdateCard] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updateStart, setUpdateStart] = useState("");
  const [updateEnd, setUpdateEnd] = useState("");
  const [courseName, setCourseName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteCard, setDeleteCard] = useState(false);
  const [viewCard, setViewCard] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(0);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Number of total pages
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    try {
      const data = { courseName, startDate, endDate };
      console.log(data);
      await createTraining(data);
      toast.success("Course added");
      setCourseName("");
      setStartDate("");
      setEndDate("");
      fetchTableData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await getTraining();
      const data = response.data;
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchFeedbackScore = async (id) => {
    try {
      const response = await getTrainerFeedback(id );
      const data = response.data;
      const score = data["average_feedback"]
      setFeedbackScore(score)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleViewCard = async (e, data) => {
    e.preventDefault();
    const { id, name, start_date, end_date } = data;
    setUpdateId(id);
    setUpdateName(name);
    setUpdateStart(start_date);
    setUpdateEnd(end_date);
    setViewCard(true);
    fetchFeedbackScore(id);
  };

  const handleUpdateCard = async (e, data) => {
    e.preventDefault();
    const { id, name, start_date, end_date } = data;
    setUpdateId(id);
    setUpdateName(name);
    setUpdateStart(start_date);
    setUpdateEnd(end_date);
    setUpdateCard(true);
  };

  const handleDeleteCard = async (e, data) => {
    e.preventDefault();
    const { id } = data;
    setUpdateId(id);
    setDeleteCard(true);
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const data = {
        name: updateName,
        start_data: updateStart,
        end_date: updateEnd,
      };
      await updateTraining(updateId, data);
      setUpdateId("");
      setUpdateName("");
      setUpdateStart("");
      setUpdateEnd("");
      toast.success("Updated Successfully");
      setUpdateCard(false);
      fetchTableData();
    } catch (error) {
      toast.error("Error while updating");
      console.log(error);
    }
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      console.log(updateId);

      await deleteTraining(updateId);
      setDeleteCard(false);
      toast.success("Deleted Successfully");
      fetchTableData();
    } catch (error) {
      toast.error("Error while deleting");
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">ADD TRAINING</h2>
      <div className="row">
        <form className="row" onSubmit={handleFormSubmit}>
          <div className="col-lg-3 mt-3">
            <label htmlFor="courseName">Name</label>
            <input
              type="text"
              className="form-control"
              id="courseName"
              placeholder="Enter course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          <div className="col-lg-3 mt-3">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="col-lg-3 mt-3">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="col-lg-3 mt-3">
            <label htmlFor="submitButton">create</label>
            <button
              type="submit"
              className="btn btn-danger d-flex align-items-center justify-content-center w-50"
              style={{ backgroundColor: "#FF6196" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="row mt-5">
        <div className="col">
          <div className="card item-card custom-card">
            <div
              className="card-header"
              style={{ backgroundColor: "#19105B", color: "#fff" }}
            >
              <h6 style={{ textAlign: "center" }}>
                <b>Training courses</b>
              </h6>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Delete </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((data) => (
                  <tr key={data.id}>
                    <td>{data.name}</td>
                    <td>{data.start_date}</td>
                    <td>{data.end_date}</td>
                    <td onClick={(e) => handleViewCard(e, data)}>
                      <i
                        class="bi bi-eye-fill ms-2"
                        style={{ cursor: "pointer", color: "#19105B" }}
                      ></i>
                    </td>
                    <td onClick={(e) => handleUpdateCard(e, data)}>
                      <i
                        class="bi bi-pencil-fill ms-1"
                        style={{ cursor: "pointer", color: "#19105B" }}
                      ></i>
                    </td>
                    <td onClick={(e) => handleDeleteCard(e, data)}>
                      <i
                        className="bi bi-trash3-fill ms-3"
                        style={{
                          cursor: "pointer",
                          color: "rgb(255, 97, 150)",
                        }}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="pagination-container">
              <Pagination className="custom-pagination">
                <Pagination.First
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    active={index + 1 === currentPage}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </div>
        </div>
      </div>
      {updateCard && (
        <div className="custom-popup-card-overlay">
          <div className="card custom-popup-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Update Course</h5>
              <i
                className="bi bi-x-lg"
                style={{ cursor: "pointer" }}
                onClick={() => setUpdateCard(false)}
              ></i>
            </div>
            <br></br>
            <form onSubmit={(e) => handleUpdate(e)}>
              <div className="form-group">
                <label htmlFor="updateName">Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setUpdateName(e.target.value)}
                  value={updateName}
                  id="updateName"
                  placeholder="Enter course name"
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="updateStart">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setUpdateStart(e.target.value)}
                  value={updateStart}
                  id="updateStart"
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="updateEnd">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setUpdateEnd(e.target.value)}
                  value={updateEnd}
                  id="updateEnd"
                />
              </div>
              <br />
              <button type="submit" className="btn btn-primary w-100">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {deleteCard && (
        <div className="custom-popup-card-overlay">
          <div className="card custom-popup-card">
            {/* <div className="card-header d-flex justify-content-between align-items-center"> */}
            <h5 className="mb-0 text-center">Are you sure?</h5>
            {/* </div> */}

            <br />
            <div className="row">
              <div className="col-md-6">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{
                    backgroundColor: "#19105B",
                    border: "#19105B 1px solid",
                  }}
                  onClick={(e) => handleDelete(e)}
                >
                  Yes
                </button>
              </div>
              <div className="col-md-6">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{
                    backgroundColor: "#FF6196",
                    border: "#FF6196 1px solid",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteCard(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewCard && (
        <div className="custom-popup-card-overlay">
          <div className="card custom-popup-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Update Course</h5>
              <i
                className="bi bi-x-lg"
                style={{ cursor: "pointer" }}
                onClick={() => setViewCard(false)}
              ></i>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="courseName" className="form-label">
                  Course Name:
                </label>
                <div id="courseName">{updateName}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date:
                </label>
                <div id="startDate">{updateStart}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date:
                </label>
                <div id="endDate">{updateEnd}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  Feedback Score:
                </label>
                <div id="endDate">{feedbackScore}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
