package pl.edu.agh.backend.compiler.files;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

@Getter
@SuperBuilder
public class RustFile {

    protected String codeFileName;

    protected String directory;

    protected String content;

    protected CommandsFactory commandsFactory;

    public String[] getCompilationCommand() {
        return new String[]{
                "cargo", "build", commandsFactory.getManifestPath(this.directory)
        };
    }

    public List<String> getContentToWrite() {
        return List.of(this.content);
    }

    public String getPath() {
        return Paths.get(this.directory) + File.separator + "src" + File.separator + this.codeFileName;
    }

    public String[] getExecutionCommand() {
        return new String[]{
                Paths.get(this.directory) + File.separator + "target" + File.separator + "debug" + File.separator +
                        this.codeFileName.split("\\.")[0] + commandsFactory.getExecutionSuffix()
        };
    }

    public String getExecutablePath() {
        return Paths.get(this.directory) + File.separator + "target" + File.separator + "debug" + File.separator +
                this.codeFileName.split("\\.")[0] + commandsFactory.getExecutionSuffix();
    }

}
