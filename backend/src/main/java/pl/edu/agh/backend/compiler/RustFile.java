package pl.edu.agh.backend.compiler;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

@Getter
@SuperBuilder
public class RustFile {
    protected String fileName;
    protected String directory;
    protected String content;

    public String[] getCommand() {
        return new String[]{"rustc", this.getPath(), "--out-dir", this.directory};
    }

    public List<String> getContentToWrite() {
        return List.of(this.content);
    }

    public String getPath() {
        return Paths.get(this.directory) + File.separator + this.fileName;
    }
}
