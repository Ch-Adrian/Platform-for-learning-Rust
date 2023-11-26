import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lessons/"

const LessonFileSaveService = {
    saveLesson: async (lessonBody, lessonName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "save", {lesson: lessonBody, name: lessonName+'.json'});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    createLesson: async (lessonBody, lessonName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "create", {lesson: lessonBody, name: lessonName+'.json'});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    renameLesson: async (oldName, newName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "rename", {newName: newName+'.json', oldName: oldName+'.json'});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    getAllLessons: async () => {
        const response = await axios
        .get(RUST_COMPILER_REST_API_URL + "list");
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    getLesson: async (name) => {
        const response = await axios.get(RUST_COMPILER_REST_API_URL + "open/" + name);
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    getDefaultLesson: async () => {
        const response = await axios.get(RUST_COMPILER_REST_API_URL + "open/new");
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    deleteSelectedLessons: async (selectedLessonNames) => {
        try {
          const response = await axios.delete(RUST_COMPILER_REST_API_URL + "delete", {
            "lessonsToDelete": [
              "NewLesson(1).json", "DUPA.json"
            ]
          });
          
          
      
          if (response.status !== 200) {
            throw new Error(response.data);
          } else {
            return response;
          }
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      }      

}

export default LessonFileSaveService;
