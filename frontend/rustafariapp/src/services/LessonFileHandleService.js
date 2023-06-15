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
    }

}

export default LessonFileSaveService;