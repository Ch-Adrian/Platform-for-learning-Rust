package pl.edu.agh.backend.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Page {
    private final List<Section> sections = new ArrayList<>();
    public void addSection(Section section) {
        this.sections.add(section);
    }
}
