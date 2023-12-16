package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class RustFileTest {


    @Test
    public void testGetCompilationCommand() {
        RustFile rustFile = RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .build();

        String expectedPath = "--manifest-path=" + "src\\main\\resources\\rust\\" + "Cargo.toml";
        String[] expectedCommand = {"cargo", "build", expectedPath};
        Assertions.assertArrayEquals(expectedCommand, rustFile.getCompilationCommand());
    }


    @Test
    public void testGetContentToWrite() {
        RustFile rustFile = RustFile.builder()
                .content("code")
                .build();

        List<String> expectedContent = List.of("code");
        Assertions.assertEquals(expectedContent, rustFile.getContentToWrite());
    }
}
