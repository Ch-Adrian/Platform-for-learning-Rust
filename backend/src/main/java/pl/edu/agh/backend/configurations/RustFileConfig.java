package pl.edu.agh.backend.configurations;

import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.RustTestsFile;

public class RustFileConfig {

    private final OperatingSystemConfig operatingSystemConfig;

    public RustFileConfig(OperatingSystemConfig operatingSystemConfig) {
        this.operatingSystemConfig = operatingSystemConfig;
    }

    public RustFile createRustFile(String content) {
        return RustFile.builder()
                .fileName("main.rs")
                .directory("src/main/resources/rust")
                .content(content)
                .operatingSystem(operatingSystemConfig.getOperatingSystem())
                .build();
    }

    public RustTestsFile createRustTestsFile(String content, String testContent) {
        return RustTestsFile.builder()
                .fileName("test.rs")
                .directory("src/main/resources/tests")
                .content(content)
                .testContent(testContent)
                .operatingSystem(operatingSystemConfig.getOperatingSystem())
                .build();
    }
}
