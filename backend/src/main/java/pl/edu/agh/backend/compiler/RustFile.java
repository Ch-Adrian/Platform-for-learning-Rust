package pl.edu.agh.backend.compiler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class RustFile {
    protected String fileName;
    protected String directory;
    protected String content;
}
