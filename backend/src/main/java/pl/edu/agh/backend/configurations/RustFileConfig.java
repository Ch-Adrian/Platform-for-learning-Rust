package pl.edu.agh.backend.configurations;

import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.RustTestsFile;

public class RustFileConfig {

    private final CommendsConfiguration commendsConfiguration;

    public RustFileConfig(CommendsConfiguration commendsConfiguration) {
        this.commendsConfiguration = commendsConfiguration;
    }

    public RustFile createRustFile(String content) {
        return RustFile.builder()
                .fileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .commandsFactory(commendsConfiguration.getOperatingSystem())
                .build();
    }

    public RustTestsFile createRustTestsFile(String content, String testContent) {
        return RustTestsFile.builder()
                .fileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .testContent(testContent)
                .commandsFactory(commendsConfiguration.getOperatingSystem())
                .build();
    }
}
