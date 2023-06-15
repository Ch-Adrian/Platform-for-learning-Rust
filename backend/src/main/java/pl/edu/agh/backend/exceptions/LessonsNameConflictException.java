package pl.edu.agh.backend.exceptions;

public class LessonsNameConflictException extends RuntimeException {

    private final String message;

    public LessonsNameConflictException(String conflictFileName) {
        this.message = "There is already lesson with name: " + conflictFileName;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
