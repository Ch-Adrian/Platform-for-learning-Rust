package pl.edu.agh.backend.compiler;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import pl.edu.agh.backend.factories.CommandsFactory;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

@Getter
@SuperBuilder
public class RustFile {
    protected String fileName;
    protected String directory;
    protected String content;
    protected CommandsFactory commandsFactory;

    public String[] getCompilationCommand() {
        return new String[]{"rustc", this.getPath(), "--out-dir", this.directory};
    }

    public List<String> getContentToWrite() {
        return List.of(this.content);
    }

    public String getPath() {
        return Paths.get(this.directory) + File.separator + this.fileName;
    }

    public String getExecutionCommand() {
        return getPath().split("\\.")[0] + commandsFactory.getExecutionSuffix();
    }
}
