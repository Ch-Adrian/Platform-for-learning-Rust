package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImmutableCodeCell extends CodeCell {
    private String mutableString;

    public static ImmutableCodeCell getDefault() {
        ImmutableCodeCell immutableCodeCell = new ImmutableCodeCell();
        immutableCodeCell.setValue("To jest komórka z niemutowalnym kodem!");
        return immutableCodeCell;
    }
}
