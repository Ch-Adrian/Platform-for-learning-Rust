package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class RustTestsFileTest {

    @Test
    public void testGetCompilationCommand() {
        RustTestsFile rustTestsFile = RustTestsFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .build();

        String expectedPath = "--manifest-path=" + "src\\main\\resources\\rust\\" + "Cargo.toml";
        String[] expectedCommand = {"cargo", "test", expectedPath, "--no-run"};
        Assertions.assertArrayEquals(expectedCommand, rustTestsFile.getCompilationCommand());
    }

    @Test
    public void testGetContentToWrite() {
        RustTestsFile rustTestsFile = RustTestsFile.builder()
                .content("code")
                .testContent("test code")
                .build();

        List<String> expectedContent = List.of("code", "test code");
        Assertions.assertEquals(expectedContent, rustTestsFile.getContentToWrite());
    }
}
