package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class RustConfigFileTest {

    @Test
    public void testGetPath() {
        RustConfigFile rustConfigFile = RustConfigFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .build();

        String expectedPath = "--manifest-path=" + "src\\main\\resources\\rust\\" + "Cargo.toml";
        String[] expectedCommand = {"cargo", "build", expectedPath};
        Assertions.assertArrayEquals(expectedCommand, rustConfigFile.getCompilationCommand());
    }

    @Test
    public void testGetContentToWrite() {
        RustConfigFile rustConfigFile = RustConfigFile.builder()
                .configContent("config")
                .build();

        List<String> expectedContent = List.of("config");
        Assertions.assertEquals(expectedContent, rustConfigFile.getContentToWrite());
    }
}
