package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TextCell extends AbstractCell {
    public static TextCell getDefault() {
        TextCell textCell = new TextCell();
        textCell.setValue("To jest komórka tekstowa. Kliknij na nią dwa razy, aby edytować zawartość.");
        return textCell;
    }
}
