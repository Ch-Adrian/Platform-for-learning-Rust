package pl.edu.agh.backend.system;

public class Windows implements OperatingSystem {

    @Override
    public String getExecutionSuffix() {
        return ".exe";
    }
}
