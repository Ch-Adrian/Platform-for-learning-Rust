package pl.edu.agh.backend.compiler.files;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import pl.edu.agh.backend.compiler.files.RustFile;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

@Getter
@SuperBuilder
public class RustConfigFile extends RustFile {
    protected String configFileName;
    protected String configContent;

    @Override
    public List<String> getContentToWrite() {
        return List.of(this.configContent);
    }

    @Override
    public String getPath() {
        return Paths.get(this.directory) + File.separator + configFileName;
    }
}
