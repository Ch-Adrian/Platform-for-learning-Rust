package pl.edu.agh.backend.compiler;

import lombok.Getter;

@Getter
public class StudentInput {

    private final String codeContent;
    private final String testContent;

    public StudentInput() {
        this.codeContent = "";
        this.testContent = "";
    }

    public StudentInput(String codeContent) {
        this.codeContent = codeContent;
        this.testContent = "";
    }

    public StudentInput(String codeContent, String testContent) {
        this.codeContent = codeContent;
        this.testContent = testContent;
    }
}
