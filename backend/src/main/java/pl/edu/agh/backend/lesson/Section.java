package pl.edu.agh.backend.lesson;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.*;

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

    public static Section getDefaultSection() {
        Section section = new Section();
        section.title = "Sekcja 1";
        section.cells.addAll(createAllCells());
        return section;
    }

    private static List<Cell> createAllCells() {
        return List.of(
                TextCell.getDefault(),
                CodeCell.getDefault(),
                ImmutableCodeCell.getDefault(),
                QuizCell.getDefault(),
                TilesCell.getDefault()
        );
    }
}
