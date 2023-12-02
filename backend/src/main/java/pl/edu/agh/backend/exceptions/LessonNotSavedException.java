package pl.edu.agh.backend.exceptions;

public class LessonNotSavedException extends RuntimeException {

    private final String message;

    public LessonNotSavedException(String fileName) {
        this.message = "Lesson could not be saved: " + fileName;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
