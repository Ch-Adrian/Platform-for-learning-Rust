package pl.edu.agh.backend.compiler;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Getter
@SuperBuilder
public class RustTestsFile extends RustFile {
    private String testContent;

    @Override
    public String[] getCompilationCommand() {
        return new String[]{"rustc", super.getPath(), "--out-dir", this.directory, "--test"};
    }

    @Override
    public List<String> getContentToWrite() {
        return List.of("mod tests {", this.content, this.testContent, "}");
    }
}
