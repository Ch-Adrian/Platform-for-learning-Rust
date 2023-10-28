package pl.edu.agh.backend.lesson;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.AbstractCell;
import pl.edu.agh.backend.lesson.cells.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Section {
    private String title;
    private final List<AbstractCell> cells = new ArrayList<>();
    public void addCell(AbstractCell cell) {
        this.cells.add(cell);
    }

    public static Section getDefaultSection() {
        Section section = new Section();
        section.title = "Sekcja 1";
        section.cells.addAll(createAllCells());
        return section;
    }

    private static List<AbstractCell> createAllCells() {
        return List.of(
                TextCell.getDefault(),
                CodeCell.getDefault(),
                ImmutableCodeCell.getDefault(),
                QuizCell.getDefault(),
                TilesCell.getDefault()
        );
    }
}
