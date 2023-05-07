package pl.edu.agh.backend.compiler;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;


@Getter
@SuperBuilder
public class RustTestsFile extends RustFile {
    private String testContent;
}
