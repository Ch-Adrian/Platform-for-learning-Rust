package pl.edu.agh.backend.factories;

public interface CommandsFactory {
    String getExecutionSuffix();

    String getManifestPath(String directory);
}
