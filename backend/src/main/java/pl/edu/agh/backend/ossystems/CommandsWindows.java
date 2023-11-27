package pl.edu.agh.backend.ossystems;

import pl.edu.agh.backend.factories.CommandsFactory;

public class CommandsWindows implements CommandsFactory {

    @Override
    public String getExecutionSuffix() {
        return ".exe";
    }
}
