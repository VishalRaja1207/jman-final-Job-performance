import React, { useEffect, useState } from "react";
import { getFeedbackTableData, updateFeedback } from "../../services/services";
import { Pagination } from "react-bootstrap";
import "../../styles/sidebar.css";
import toast from "react-hot-toast";
import "../../styles/page.css"

const Feedback = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15); // Rows per page can be set here
  const [trainId, setTrainId] = useState(0);
  const [trainName, setTrainName] = useState('');
  const [selectedOptionsFeedback1, setSelectedOptionsFeedback1] = useState('1');
  const [selectedOptionsFeedback2, setSelectedOptionsFeedback2] = useState('1');
  const [selectedOptionsFeedback3, setSelectedOptionsFeedback3] = useState('1');
  const [selectedOptionsFeedback4, setSelectedOptionsFeedback4] = useState('1');
  const [addCard, setAddCard] = useState(false);
  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await getFeedbackTableData();
      const data = response.data;
      console.log(data);
      
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Access selected feedback values
    const training_id = trainId
    const feedback1 = selectedOptionsFeedback1;
    const feedback2 = selectedOptionsFeedback2;
    const feedback3 = selectedOptionsFeedback3;
    const feedback4 = selectedOptionsFeedback4;

    const data = {training_id, feedback1, feedback2, feedback3, feedback4}
    try {
        console.log(data);
        
        await updateFeedback(data)
        setSelectedOptionsFeedback1(0);
        setSelectedOptionsFeedback2(0);
        setSelectedOptionsFeedback3(0);
        setSelectedOptionsFeedback4(0);
        setAddCard(false);
        setTrainId(0)
        setTrainName('')  
        toast.success("Submitted Successfully")
    } catch (error) {
        toast.error("Error while submitting")
        console.log(error);
    }    
    // You can now calculate the average score or perform other actions here
    };


  const handleAddFeedback = async (e, data) => {
    e.preventDefault();
    try {
      const training_id = data.Training.id;
      const training_name = data.Training.name;
      console.log(training_name);
      
      setTrainId(training_id);
      setTrainName(training_name)
      setAddCard(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Get the current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Number of total pages
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="container">
      <h2 className="my-4">PERFORMANCE FEEDBACK</h2>
      <div className="row">
      <div className="card item-card custom-card">
      <div className="card-header" style={{backgroundColor: "#19105B", color: "#fff"}}>
              <h6 style={{ textAlign: "center" }}>
                <b>Feedback</b>
              </h6>
            </div>
          <div className="col">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>start_date</th>
                  <th>end_date</th>
                  <th>Result</th>
                  <th>Feedbacks</th>
                  <th>Add Your Feedback</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((data) => (
                  <tr key={data.Training.id}>
                    <td>{data.Training.name}</td>
                    <td>{data.Training.start_date}</td>
                    <td>{data.Training.end_date}</td>
                    <td>{data.status}</td>
                    <td>{data.trainer_feedback ? data.trainer_feedback : "Feedback dosen't provided!!!"}</td>
                    <td>
                      <i
                        className="fs-5 bi bi-plus-circle ms-5"
                        style={{ cursor: "pointer", color: "#19105B"}}
                        onClick={(e) => handleAddFeedback(e, data)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
        {addCard && trainId !== 0 && trainName !== '' && (
          <div className="custom-popup-card-overlay">
            <div className="card custom-popup-card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Overview</h5>
                <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={(e) => {e.preventDefault(); setAddCard(false)}}></i>
            </div>
            <br></br>
              <form onSubmit={(e) => handleFormSubmit(e)}>
                <div className="form-group">
                   <input type = "text" value = {trainId} hidden/> 
                  <label for="exampleFormControlInput1">Training Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    disabled
                    value = {trainName}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label for="exampleFormControlInput1">Feedback 1 name</label>
                  <select
                    className="form-select"
                    id="designationDropdown"
                    value={selectedOptionsFeedback1}
                    onChange={(e) => {
                      setSelectedOptionsFeedback1(e.target.value);
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <br></br>
                <div className="form-group">
                  <label for="exampleFormControlInput1">Feedback 2 name</label>
                  <select
                    className="form-select"
                    id="designationDropdown"
                    value={selectedOptionsFeedback2}
                    onChange={(e) => {
                      setSelectedOptionsFeedback2(e.target.value);
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <br></br>
                <div className="form-group">
                  <label for="exampleFormControlInput1">Feedback 3 name</label>
                  <select
                    className="form-select"
                    id="designationDropdown"
                    value={selectedOptionsFeedback3}
                    onChange={(e) => {
                      setSelectedOptionsFeedback3(e.target.value);
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <br></br>
                <div className="form-group">
                  <label for="exampleFormControlInput1">Feedback 4 name</label>
                  <select
                    className="form-select"
                    id="designationDropdown"
                    value={selectedOptionsFeedback4}
                    onChange={(e) => {
                      setSelectedOptionsFeedback4(e.target.value);
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <br></br>
                <div className="row m-0">
                  <div className="col m-0">
                    <button
                      type="submit"
                      className="btn btn-danger d-flex align-items-center justify-content-center w-100"
                      style={{ backgroundColor: "#FF6196" }}
                      //   onClick={handleClick}
                    >
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
