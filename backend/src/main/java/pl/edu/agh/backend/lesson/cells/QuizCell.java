package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.records.Answer;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuizCell extends Cell {
    private final List<Answer> answers = new ArrayList<>();

    public void addAnswer(Answer answer) {
        this.answers.add(answer);
    }

    public static QuizCell getDefault() {
        QuizCell quizCell = new QuizCell();
        quizCell.setValue("To jest komórka typu quiz! W tym miejscu możesz wpisać pytanie.");

        Answer answer1 = new Answer(1, "Niepoprawna odpowiedz.", false);
        Answer answer2 = new Answer(2, "Poprawna odpowiedz.", true);
        Answer answer3 = new Answer(3, "Niepoprawna odpowiedz.", false);
        quizCell.addAnswer(answer1);
        quizCell.addAnswer(answer2);
        quizCell.addAnswer(answer3);
        return quizCell;
    }
}
