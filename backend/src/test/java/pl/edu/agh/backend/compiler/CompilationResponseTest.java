package pl.edu.agh.backend.compiler;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class CompilationResponseTest {

    @Test
    public void testGetErrorWhenCompilationErrorExists() {
        CompilationResponse response = CompilationResponse.builder()
                .status(Status.ERROR)
                .compilationError("Syntax error")
                .build();

        String error = response.getAll();
        assertTrue(error.contains("### **Compilation error:**"));
        assertTrue(error.contains("Syntax error"));
    }

    @Test
    public void testGetOutputWhenProgramOutputExists() {
        CompilationResponse response = CompilationResponse.builder()
                .status(Status.NORMAL)
                .programOutput("Program output")
                .build();

        String output = response.getAll();
        assertTrue(output.contains("Program output"));
    }

    @Test
    public void testGetOutputWhenCompilerMessageExists() {
        CompilationResponse response = CompilationResponse.builder()
                .status(Status.NORMAL)
                .compilerMessage("Compilation successful")
                .build();

        String output = response.getAll();
        assertTrue(output.contains("### **Compiler message:**"));
        assertTrue(output.contains("Compilation successful"));
    }

    @Test
    public void testGetOutputWhenTestsOutputExists() {
        CompilationResponse response = CompilationResponse.builder()
                .status(Status.NORMAL)
                .testsOutput("Tests output")
                .build();

        String output = response.getAll();
        assertTrue(output.contains("### **Tests output:**"));
        assertTrue(output.contains("Tests output"));
    }

    @Test
    public void testGetOutputForSuccessWithoutMessages() {
        CompilationResponse response = CompilationResponse.builder()
                .status(Status.NORMAL)
                .build();

        String output = response.getAll();
        assertEquals("", output);
    }
}
