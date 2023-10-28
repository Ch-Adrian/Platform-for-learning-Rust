package pl.edu.agh.backend.lesson;

import lombok.Getter;
import lombok.Setter;

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
        Lesson lesson = new Lesson();
        lesson.addPage(Page.getDefaultPage());
        return lesson;
    }
}
