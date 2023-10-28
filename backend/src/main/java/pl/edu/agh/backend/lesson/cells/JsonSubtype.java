package pl.edu.agh.backend.lesson.cells;

public @interface JsonSubtype {
    Class<?> clazz();

    String name();
}
