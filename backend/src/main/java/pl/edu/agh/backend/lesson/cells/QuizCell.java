package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.records.Option;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuizCell extends Cell {
    private final List<Option> options = new ArrayList<>();

    public void addOption(Option option) {
        this.options.add(option);
    }

    public static QuizCell getDefault() {
        QuizCell quizCell = new QuizCell();
        quizCell.setValue("Tutaj możesz dodać pytanie.");

        return quizCell;
    }
}
