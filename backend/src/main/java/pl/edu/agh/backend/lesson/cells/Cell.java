package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cell {
    private Type type;
    private String value;
    private String test;
    private String reference;
    private String mutableString;
}
