import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lesson/"

const LessonFileHandleService = {
    saveLesson: async (lessonBody, lessonName) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "save", {lesson: lessonBody, name: lessonName+'.json'});
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    }
}

export default LessonFileHandleService;