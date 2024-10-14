import axiosInstance from "../interceptors/axios-config";
const url='http://localhost:5000/api/v1';

//Dashboard
export const getDashTableData = () => {
    return axiosInstance.get(`${url}/admin/cummulative`)
}
export const getDashBarData = () => {
    return axiosInstance.get(`${url}/admin/training/scores`)
}
export const getRetentionData = () => {
    return axiosInstance.get(`${url}/admin/retention/all`)
}
export const getEmployeeCount = () => {
    return axiosInstance.get(`${url}/admin/employees/no`)
}

//score
export const getScores = (designation, training) => {
    return axiosInstance.get(`${url}/admin/scores?designation=${designation}&training_id=${training}`)
}
export const getTraining = () => {
    return axiosInstance.get(`${url}/admin/training`)
}
export const deletePerformanceScores = (emp_id, training_id) => {
    return axiosInstance.delete(`${url}/admin/scores?emp_id=${emp_id}&training_id=${training_id}`)
}
export const getDashPieData = () => {
    return axiosInstance.get(`${url}/admin/designation/scores`)
}
export const postFile = (id, data) => {
    return axiosInstance.post(`${url}/admin/upload/score?id=${id}`, data,)
}


//performance
export const getEmplyeesByDesignation = (designation) => {
    return axiosInstance.get(`${url}/admin/employees?designation=${designation}`)
}
export const getEmployeeHistory = (id) => {
    return axiosInstance.get(`${url}/admin/history?id=${id}`)
}


//training
export const createTraining = (data) => {
    return axiosInstance.post(`${url}/admin/training`, data)
}

export const updateTraining = (id, data) => {
    return axiosInstance.put(`${url}/admin/training?id=${id}`, data)
}

export const deleteTraining = (id) => {
    return axiosInstance.delete(`${url}/admin/training?id=${id}`)
}

export const getTrainerFeedback = (id) => {
    return axiosInstance.get(`${url}/admin/training/cummulative?id=${id}`)
}

//employee
export const getEmployeeCard = () => {
    return axiosInstance.get(`${url}/employee`)
}

export const getEmployeePassData = () => {
    return axiosInstance.get(`${url}/employee/pass`)
}

export const getEmployeeFailData = () => {
    return axiosInstance.get(`${url}/employee/fail`)
}


//feedback
export const getFeedbackTableData = () => {
    return axiosInstance.get(`${url}/employee/feedback`)
}

export const updateFeedback = (data) => {
    return axiosInstance.put(`${url}/employee/feedback`, data)
}