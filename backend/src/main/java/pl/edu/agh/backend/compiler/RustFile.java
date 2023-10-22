package pl.edu.agh.backend.compiler;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.io.File;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Getter
@SuperBuilder
public class RustFile {
    protected String fileName;
    protected String directory;
    protected String content;
    protected CommandsFactory commandsFactory;

    public String[] getCompilationCommand() { return new String[]{"cargo",  "build", "--manifest-path=" + Paths.get(this.directory) + File.separator + "Cargo.toml"}; }

    public List<String> getContentToWrite() {
        return List.of(this.content);
    }

    public String getPath() { return Paths.get(this.directory) + File.separator + "src" + File.separator + this.fileName; }

    public String[] getExecutionCommand() { return new String[]{Paths.get(this.directory) + File.separator + "target" + File.separator + "debug" + File.separator + this.fileName.split("\\.")[0] + commandsFactory.getExecutionSuffix()}; }

    public String getExecutablePath() { return Paths.get(this.directory) + File.separator + "target" + File.separator + "debug" + File.separator + this.fileName.split("\\.")[0] + commandsFactory.getExecutionSuffix(); }


}
