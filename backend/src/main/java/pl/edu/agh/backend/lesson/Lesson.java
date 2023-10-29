package pl.edu.agh.backend.lesson;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Lesson {
    private String cargoToml;
    private final List<Page> pages = new ArrayList<>();

    public void addPage(Page page) {
        this.pages.add(page);
    }

    public static Lesson getDefaultLesson() {
        Lesson lesson = new Lesson();
        lesson.setCargoToml("""
                [package]
                name = "main"
                version = "0.1.0"
                edition = "2021"
                                
                # See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
                                
                [dependencies]""");

        lesson.addPage(Page.getDefaultPage());
        return lesson;
    }
}
