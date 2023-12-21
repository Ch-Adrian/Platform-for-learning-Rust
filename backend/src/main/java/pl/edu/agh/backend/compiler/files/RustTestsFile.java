package pl.edu.agh.backend.compiler.files;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@SuperBuilder
public class RustTestsFile extends RustFile {

    private String testContent;

    @Override
    public String[] getCompilationCommand() {
        return new String[]{
                "cargo", "test", commandsFactory.getManifestPath(this.directory), "--no-run"
        };
    }

    @Override
    public List<String> getContentToWrite() {
        return List.of(this.content, this.testContent);
    }

    @Override
    public String[] getExecutionCommand() {
        return new String[]{
                "cargo", "test", commandsFactory.getManifestPath(this.directory)
        };
    }

}
