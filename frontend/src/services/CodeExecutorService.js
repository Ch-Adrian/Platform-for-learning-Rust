import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lesson/"

const CodeExecutorService = {
    compileAndRun: async (codeValue) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "code", {
        item: codeValue
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },

    compileTestAndRun: async (codeValue, testValue) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "test", {
          item: codeValue,
          testContent: testValue
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    }
};

export default CodeExecutorService;