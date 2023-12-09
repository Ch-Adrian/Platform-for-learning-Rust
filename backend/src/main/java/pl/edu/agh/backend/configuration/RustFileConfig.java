package pl.edu.agh.backend.configuration;

import pl.edu.agh.backend.compiler.files.RustConfigFile;
import pl.edu.agh.backend.compiler.files.RustFile;
import pl.edu.agh.backend.compiler.files.RustTestsFile;
import pl.edu.agh.backend.factories.CommandsFactory;

public class RustFileConfig {

    private final CommandsFactory commandsFactory;

    public RustFileConfig(CommandsFactory commandsFactory) {
        this.commandsFactory = commandsFactory;
    }

    public RustFile createRustFile(String content) {
        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commandsFactory)
                .build();
    }

    public RustTestsFile createRustTestsFile(String content, String testContent) {
        return RustTestsFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .testContent(testContent)
                .commandsFactory(commandsFactory)
                .build();
    }

    public RustConfigFile createRustConfigFile(String configContent) {
        return RustConfigFile.builder()
                .codeFileName("main.rs")
                .configFileName("Cargo.toml")
                .directory("src/main/resources/rust")
                .configContent(configContent)
                .commandsFactory(commandsFactory)
                .build();
    }
}
