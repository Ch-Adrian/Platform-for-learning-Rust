package pl.edu.agh.backend.services;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.CompilerResponse;
import pl.edu.agh.backend.compiler.RustTestsFile;
import pl.edu.agh.backend.compiler.Status;
import java.io.*;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@Service
public class CompilerService {

    private String exeEnding = ".exe";
    public CompilerService(){
        if (Objects.equals(System.getProperty("os.name"), "Linux")){
            this.exeEnding = "";
        }
    }

    public CompilerResponse run(RustFile rustFile) {
        String path = Paths.get(rustFile.getDirectory()) + File.separator + rustFile.getFileName();
        try {
            writeContentToFile(path, rustFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(getCommand(path, rustFile));
        StringBuilder compilerMessage = new StringBuilder();

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                compilerMessage.append(line);
                compilerMessage.append("\n");
            }

            process.waitFor();
            File fileExecutable = new File(path.split("\\.")[0] + exeEnding);

            if (!fileExecutable.exists()) {
                FileUtils.cleanDirectory(new File(rustFile.getDirectory()));
                return CompilerResponse.builder()
                        .status(Status.ERROR)
                        .compilerMessage(compilerMessage.toString())
                        .build();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        StringBuilder actualOutput = new StringBuilder();
        processBuilder.command(path.split("\\.")[0] + exeEnding);

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                actualOutput.append(line);
                actualOutput.append("\n");
            }

            process.waitFor();
            FileUtils.cleanDirectory(new File(rustFile.getDirectory()));
            createFileGitKeep(rustFile.getDirectory());

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return getResponse(compilerMessage, actualOutput, rustFile);
    }

    private CompilerResponse getResponse(StringBuilder compilerMessage, StringBuilder actualOutput, RustFile rustFile) {
        if (rustFile instanceof RustTestsFile) {
            return CompilerResponse.builder()
                    .status(getStatus(compilerMessage))
                    .compilerMessage(compilerMessage.toString())
                    .testsOutput(actualOutput.toString())
                    .build();
        } else {
            return CompilerResponse.builder()
                    .status(getStatus(compilerMessage))
                    .compilerMessage(compilerMessage.toString())
                    .actualOutput(actualOutput.toString())
                    .build();
        }
    }

    private void writeContentToFile(String path, RustFile rustFile) throws IOException {
        FileWriter fileWriter = new FileWriter(path);
        for (String batch: contentToWrite(rustFile)) {
            fileWriter.write(batch);
        }
        fileWriter.close();
    }

    private List<String> contentToWrite(RustFile rustFile) {
        if (rustFile instanceof RustTestsFile) {
            return List.of("mod tests {", rustFile.getContent(), ((RustTestsFile) rustFile).getTestContent(), "}");
        } else {
            return List.of(rustFile.getContent());
        }
    }

    private String[] getCommand(String path, RustFile rustFile) {
        if (rustFile instanceof RustTestsFile) {
            return new String[]{"rustc", path, "--out-dir", rustFile.getDirectory(), "--test"};
        } else {
            return new String[]{"rustc", path, "--out-dir", rustFile.getDirectory()};
        }
    }

    private Status getStatus(StringBuilder message) {
        if (message.isEmpty()) {
            return Status.NORMAL;
        } else {
            return Status.WARNINGS;
        }
    }

    private void createFileGitKeep(String directory) {
        try {
            File gitKeep = new File(directory + File.separator + ".gitkeep");
            if (gitKeep.createNewFile()) {
                System.out.println("File .gitkeep created.");
            }
        } catch(IOException exception){
            System.err.println("Error: Cannot create .gitkeep file.");
        }
    }
}
