package pl.edu.agh.backend.compiler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.edu.agh.backend.compiler.files.RustFile;
import pl.edu.agh.backend.configuration.AppConfig;
import pl.edu.agh.backend.factories.CommandsFactory;

import static org.junit.jupiter.api.Assertions.*;

class ProgramProcessTest {

    CommandsFactory commandsFactory;

    @BeforeEach
    void setUp() {
        commandsFactory = new AppConfig().getOperatingSystem();
    }

    @Test
    public void testCompileProgramNoCompilationError() {
        // Given
        RustFile rustFile = getHelloWorldRustFile();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();

        // Then
        assertNull(compilationResponse.getCompilationError());
    }

    @Test
    public void testCompileProgramHelloWorldOutput() {
        // Given
        RustFile rustFile = getHelloWorldRustFile();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String expectedOutput = "Hello World!\n";
        String actualOutput = compilationResponse.getAll();

        // Then
        assertEquals(expectedOutput, actualOutput);
    }

    @Test
    public void testCompileProgramEmptyCompilerMessage() {
        // Given
        RustFile rustFile = getHelloWorldRustFile();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String expectedOutput = "";
        String actualOutput = compilationResponse.getCompilerMessage();

        // Then
        assertEquals(expectedOutput, actualOutput);
    }

    @Test
    public void testCompileProgramInvalidSyntaxCompilationError() {
        // Given
        RustFile rustFile = getRustFileWithSyntaxError();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String actualOutput = compilationResponse.getCompilationError();

        // Then
        assertTrue(actualOutput.contains("**Compiler response:**"));
        assertTrue(actualOutput.contains("error: expected type"));
    }

    @Test
    public void testCompileProgramInvalidSyntaxNoCompilerMessage() {
        // Given
        RustFile rustFile = getRustFileWithSyntaxError();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String actualOutput = compilationResponse.getCompilerMessage();

        // Then
        assertNull(actualOutput);
    }

    @Test
    public void testCompileProgramInvalidSyntaxGetAll() {
        // Given
        RustFile rustFile = getRustFileWithSyntaxError();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String actualOutput = compilationResponse.getAll();

        // Then
        assertTrue(actualOutput.contains("**Compiler response:**"));
        assertTrue(actualOutput.contains("error: expected type"));
    }

    @Test
    public void testDivisionByZeroCompilationError() {
        // Given
        RustFile rustFile = getRustFileDivisionByZero();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String actualOutput = compilationResponse.getCompilationError();

        // Then
        assertTrue(actualOutput.contains("**Compiler response:**"));
        assertTrue(actualOutput.contains("error: this operation will panic at runtime"));
    }

    @Test
    public void testDivisionByZeroRuntimeError() {
        // Given
        RustFile rustFile = getRustFileDivisionByZeroRuntime();

        // When
        CompilationResponse compilationResponse = new ProgramProcess(rustFile).runProcess();
        String actualOutput = compilationResponse.getCompilerMessage();

        // Then
        assertTrue(actualOutput.contains("thread 'main' panicked at 'attempt to divide by zero"));
    }

    private RustFile getHelloWorldRustFile() {
        String content = """
                fn main() {
                    println!("Hello World!");
                }
                """;

        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commandsFactory)
                .build();
    }

    private RustFile getRustFileWithSyntaxError() {
        String content = """
                fn main() {
                    for i in range(10):
                        print("Hi from python loop!")
                }
                """;

        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commandsFactory)
                .build();
    }

    private RustFile getRustFileDivisionByZero() {
        String content = """
                fn main() {
                    let a:i32 = 5;
                    let b:i32 = 0;
                    println!("{}", a / b);
                }
                """;

        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commandsFactory)
                .build();
    }

    private RustFile getRustFileDivisionByZeroRuntime() {
        String content = """
                fn divide_by(dividend: i32, divisor: i32) -> i32 {
                    dividend / divisor
                }
                fn main() {
                    let a:i32 = 5;
                    let b:i32 = 0;
                    println!("{}", divide_by(a, b));
                }
                """;

        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commandsFactory)
                .build();
    }

}