package pl.edu.agh.backend.compiler;

import lombok.Getter;

@Getter
public class StudentInput {

    private final String item;
    private final String testContent;

    public StudentInput() {
        item = "";
        testContent = "";
    }

    public StudentInput(String item) {
        this.item = item;
        this.testContent = "";
    }

    public StudentInput(String item, String testContent) {
        this.item = item;
        this.testContent = testContent;
    }
}
