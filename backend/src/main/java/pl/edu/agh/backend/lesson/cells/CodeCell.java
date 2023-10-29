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
        codeCell.setValue(
                """
                        // To jest komórka z kodem. Możesz dodać kod, dodatkowy edytor do pisania testów, oraz \r
                        // edytor w którym zapiszesz swoje modelowe rozwiązanie, do którego tylko nauczyciel \r
                        // będzie miał dostęp
                        """);
        return codeCell;
    }
}
