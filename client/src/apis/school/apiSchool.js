import axios from 'axios';
axios.defaults.withCredentials = true;
// for dropdown (general)
export const getSchools = async () => {
  try {
    const response = await axios.get('/api/schools');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAttendanceThresholdAdmin = async (data) => {
    try {
    const response = await axios.patch('/api/schools/attendance-threshold',data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const createAcademicYear = async (data) => {
    try {
    const response = await axios.post('/api/schools/academic-year',data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const switchSemester = async (data) => {
    try {
    const response = await axios.put('/api/schools/academic-year/semester/switch',data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
