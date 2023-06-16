package pl.edu.agh.backend.lesson;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.Cell;
import pl.edu.agh.backend.lesson.cells.Type;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
public class Lesson {
    private final List<Page> pages = new ArrayList<>();
    public void addPage(Page page) {
        this.pages.add(page);
    }
    public static Lesson getDefaultLesson() {
        Cell textCell = new Cell();
        textCell.setType(Type.text);
        textCell.setValue("To jest komórka tekstowa. Kliknij na nią dwa razy, aby edytować zawartość.");

        Cell codeCell = new Cell();
        codeCell.setType(Type.code);
        codeCell.setValue(
                """
                // To jest komórka z kodem. Możesz dodać kod, dodatkowy edytor do pisania testów, oraz \r
                // edytor w którym zapiszesz swoje modelowe rozwiązanie, do którego tylko nauczyciel \r
                // będzie miał dostęp
                """);
        Section section = new Section();
        section.setTitle("Nowa Sekcja");
        section.addCell(textCell);
        section.addCell(codeCell);

        Page page = new Page();
        page.addSection(section);

        Lesson lesson = new Lesson();
        lesson.addPage(page);

        return lesson;
    }
}
