package pl.edu.agh.backend.compiler;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;


@Getter
@SuperBuilder
public class RustTestsFile extends RustFile {
    private String testContent;

    @Override
    public String[] getCompilationCommand() { return new String[]{"cargo",  "test", "--manifest-path=" + Paths.get(this.directory) + File.separator + "Cargo.toml", "--no-run"}; }

    @Override
    public List<String> getContentToWrite() { return List.of(this.content, this.testContent); }

    @Override
    public String[] getExecutionCommand() { return new String[]{"cargo",  "test", "--manifest-path=" + Paths.get(this.directory) + File.separator + "Cargo.toml"}; }
}
