package pl.edu.agh.backend.compiler.files;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.edu.agh.backend.configuration.AppConfig;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.util.List;

public class RustTestsFileTest {

    private CommandsFactory commandsFactory;

    @BeforeEach
    void setUp() {
        commandsFactory = new AppConfig().getOperatingSystem();
    }

    @Test
    public void testGetCompilationCommand() {
        RustTestsFile rustTestsFile = RustTestsFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .commandsFactory(commandsFactory)
                .build();

        String expectedPath = commandsFactory.getManifestPath("src/main/resources/rust");
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
