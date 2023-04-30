import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lesson/code"

const CodeExecutorService = {
    compileAndRun: async (codeValue) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL, {
          item: codeValue
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    }
};

export default CodeExecutorService;