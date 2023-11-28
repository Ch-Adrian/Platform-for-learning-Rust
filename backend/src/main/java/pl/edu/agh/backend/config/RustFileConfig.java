package pl.edu.agh.backend.config;

import pl.edu.agh.backend.compiler.files.RustConfigFile;
import pl.edu.agh.backend.compiler.files.RustFile;
import pl.edu.agh.backend.compiler.files.RustTestsFile;

public class RustFileConfig {

    private final CommendsConfiguration commendsConfiguration;

    public RustFileConfig(CommendsConfiguration commendsConfiguration) {
        this.commendsConfiguration = commendsConfiguration;
    }

    public RustFile createRustFile(String content) {
        return RustFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commendsConfiguration.getOperatingSystem())
                .build();
    }

    public RustTestsFile createRustTestsFile(String content, String testContent) {
        return RustTestsFile.builder()
                .codeFileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .testContent(testContent)
                .commandsFactory(commendsConfiguration.getOperatingSystem())
                .build();
    }

    public RustConfigFile createRustConfigFile(String configContent) {
        return RustConfigFile.builder()
                .codeFileName("main.rs")
                .configFileName("Cargo.toml")
                .directory("src/main/resources/rust")
                .configContent(configContent)
                .commandsFactory(commendsConfiguration.getOperatingSystem())
                .build();
    }
}
