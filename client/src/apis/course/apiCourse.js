import axios from 'axios';
axios.defaults.withCredentials = true;

export const getLecturerAssignedCourses = async () => {
  try {
    const response = await axios.get('/api/lecturer/courses');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudentRegisteredCourses = async () => {
  try {
    const response = await axios.get('/api/student/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllCourses = async ({ queryKey }) => {
  const [_key, query] = queryKey;
  const params = new URLSearchParams(query).toString()


  try {
    const response = await axios.get(`/api/courses?${params}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// create course (admin)
export const createCourse = async (data) => {
  try {
    const response = await axios.post('/api/admin/courses', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// edit course (admin)
export const editCourse = async (data) => {
  try {
    const { id, ...updateData } = data;
    const response = await axios.put(`/api/admin/courses/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// delete course (admin)
export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`/api/admin/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



// lecturer assign self to course
export const assignToCourse = async (data) => {
 
  try {
    const response = await axios.post(`/api/lecturer/courses/assign`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
