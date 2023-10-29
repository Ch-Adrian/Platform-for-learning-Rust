package pl.edu.agh.backend.serialization;

public @interface JsonSubtype {
    Class<?> clazz();

    String name();
}
