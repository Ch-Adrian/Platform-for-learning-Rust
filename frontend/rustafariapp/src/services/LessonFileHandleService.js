import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lesson/"

const LessonFileHandleService = {
    getDirectory: async (parentDir) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "directory/pick", {item: parentDir});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },
    saveLesson: async (path, lesson) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "save", {path: path, lesson: lesson});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    }
}

export default LessonFileHandleService;