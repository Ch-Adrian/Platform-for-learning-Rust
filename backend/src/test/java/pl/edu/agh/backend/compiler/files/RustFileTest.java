package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.edu.agh.backend.configuration.AppConfig;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.util.List;

public class RustFileTest {

    protected CommandsFactory commandsFactory;

    @BeforeEach
    void setUp() {
        commandsFactory = new AppConfig().getOperatingSystem();
    }

    @Test
    public void testGetCompilationCommand() {
        RustFile rustFile = RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .commandsFactory(commandsFactory)
                .build();

        String expectedPath = commandsFactory.getManifestPath("src/main/resources/rust");
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
