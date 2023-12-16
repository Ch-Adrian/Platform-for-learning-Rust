package pl.edu.agh.backend.services;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.backend.configuration.RustFileConfig;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class CompilerServiceImplTest {

    @Autowired
    private CompilerService compilerService;

    @Autowired
    private RustFileConfig rustFileConfig;

    @Test
    void testRun() {
        // Given
        String content = """
                fn main() {
                    println!("Hello World!");
                }
                """;

        // When
        String output = compilerService.run(rustFileConfig.createRustFile(content)).getAll();

        // Then
        assertEquals("Hello World!\n", output);
    }

    @Test
    void testRunWithTests() {
        // Given
        String content = """
                fn test_func(x: i32) -> i32  {\s
                    x - 5
                }
                                
                fn main() {
                    println!("{}", test_func(5));
                }
                """;
        String testsContent = """
                #[test]
                fn test1() {
                    let result = 5;
                    assert_eq!(result, test_func(10));
                }
                                
                #[test]
                fn test2() {
                    let result = -1;
                    assert_eq!(result, test_func(4));
                }
                                
                #[test]
                fn test3() {
                    let result = -425;
                    assert_eq!(result, test_func(-420));
                }
                """;

        String expectedFirstLine = "running 3 tests";
        String expectedSecondLine = "test test1 ... ok";
        String expectedThirdLine = "test test2 ... ok";
        String expectedForthLine = "test test3 ... ok";
        String expectedFifthLine = "test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out";

        // When
        String output = compilerService.run(rustFileConfig.createRustTestsFile(content, testsContent)).getTestsOutput();

        //Then
        assertTrue(output.contains(expectedFirstLine));
        assertTrue(output.contains(expectedSecondLine));
        assertTrue(output.contains(expectedThirdLine));
        assertTrue(output.contains(expectedForthLine));
        assertTrue(output.contains(expectedFifthLine));
    }

    @Test
    void testConfigure() {
    }
}