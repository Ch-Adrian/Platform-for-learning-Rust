import axios from 'axios'
const RUST_COMPILER_REST_API_URL = "http://localhost:8080/compilations"

const CodeExecutorService = {
    buildCargo: async (configContent) => {
        const response = await axios
        .put(RUST_COMPILER_REST_API_URL + "/config", {
        codeContent: configContent
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },

    compileAndRun: async (codeValue) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "/code", {
        codeContent: codeValue
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        } else {
            return response;
        }
    },

    compileTestAndRun: async (codeValue, testValue) => {
        const response = await axios
        .post(RUST_COMPILER_REST_API_URL + "/test", {
        codeContent: codeValue,
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