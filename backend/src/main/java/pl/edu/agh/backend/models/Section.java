package pl.edu.agh.backend.models;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.models.cells.Cell;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Section {
    private String title;
    private final List<Cell> cells = new ArrayList<>();
    public void addCell(Cell cell) {
        this.cells.add(cell);
    }
}
