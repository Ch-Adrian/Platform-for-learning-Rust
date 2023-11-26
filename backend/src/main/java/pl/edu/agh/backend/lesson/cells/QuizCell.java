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
        quizCell.setValue("To jest komórka typu quiz! W tym miejscu możesz wpisać pytanie.");

        Option option1 = new Option(1, "Niepoprawna odpowiedz.", false);
        Option option2 = new Option(2, "Poprawna odpowiedz.", true);
        Option option3 = new Option(3, "Niepoprawna odpowiedz.", false);
        quizCell.addOption(option1);
        quizCell.addOption(option2);
        quizCell.addOption(option3);
        return quizCell;
    }
}
