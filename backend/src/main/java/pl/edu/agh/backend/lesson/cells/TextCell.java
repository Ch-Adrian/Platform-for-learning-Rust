package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TextCell extends Cell {
    public static TextCell getDefault() {
        TextCell textCell = new TextCell();
        textCell.setValue("Nowa komórka z tekstem");
        return textCell;
    }
}