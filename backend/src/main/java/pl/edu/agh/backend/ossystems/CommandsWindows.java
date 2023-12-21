package pl.edu.agh.backend.ossystems;

import pl.edu.agh.backend.factories.CommandsFactory;

import java.io.File;
import java.nio.file.Paths;

public class CommandsWindows implements CommandsFactory {

    @Override
    public String getExecutionSuffix() {
        return ".exe";
    }

    @Override
    public String getManifestPath(String directory) {
        return "--manifest-path=" + Paths.get(directory) + File.separator + "Cargo.toml";
    }
}
