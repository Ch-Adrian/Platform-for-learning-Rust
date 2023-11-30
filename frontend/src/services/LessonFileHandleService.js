import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lessons"

const LessonFileSaveService = {
    saveLesson: async (lessonBody, lessonName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "/" + lessonName + ".json", lessonBody);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    createLesson: async (lessonBody, lessonName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL, {name: lessonName + ".json", lesson: lessonBody});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    renameLesson: async (oldName, newLessonName) => { 
        let config = {
            headers: {
                "Content-Type": "text/plain"
            }
          }
        const response = await axios
        .put(RUST_COMPILER_REST_API_URL + "/" + oldName + ".json", newLessonName + ".json", config);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    getAllLessons: async () => {
        const response = await axios
        .get(RUST_COMPILER_REST_API_URL);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    getLesson: async (name) => {
        const response = await axios.get(RUST_COMPILER_REST_API_URL + "/" + name);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    
    getDefaultLesson: async () => {
        const response = await axios.get(RUST_COMPILER_REST_API_URL + "/default");
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    deleteSelectedLessons: async (selectedLessonNames) => {
        const response = await axios.delete(RUST_COMPILER_REST_API_URL + '/deleteBatch', {data: selectedLessonNames});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    deleteLesson: async (name) => {
        const response = await axios.delete(RUST_COMPILER_REST_API_URL + "/" + name);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    }       
}

export default LessonFileSaveService;
