package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeCell extends Cell {
    String test;
    String reference;

    public static CodeCell getDefault() {
        CodeCell codeCell = new CodeCell();
        codeCell.setValue("""
                fn main() {

                }""");
        return codeCell;
    }
}
