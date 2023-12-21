package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.edu.agh.backend.configuration.AppConfig;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.util.List;

public class RustConfigFileTest {

    private CommandsFactory commandsFactory;

    @BeforeEach
    void setUp() {
        commandsFactory = new AppConfig().getOperatingSystem();
    }

    @Test
    public void testGetPath() {
        RustConfigFile rustConfigFile = RustConfigFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .commandsFactory(commandsFactory)
                .build();

        String expectedPath = commandsFactory.getManifestPath("src/main/resources/rust");
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
