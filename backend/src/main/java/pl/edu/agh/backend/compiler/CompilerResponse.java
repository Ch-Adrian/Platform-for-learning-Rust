package pl.edu.agh.backend.compiler;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CompilerResponse {

    private Status status;

    private String compilerMessage;

    private String actualOutput;

    private String testsOutput;

    public String getAll() {
        return this.compilerMessage + "\n" + this.actualOutput;
    }

}
