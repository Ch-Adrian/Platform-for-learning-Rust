package pl.edu.agh.backend.services;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.RustTestFile;
import pl.edu.agh.backend.compiler.CompilerResponse;
import pl.edu.agh.backend.compiler.Status;
import java.io.*;
import java.nio.file.Paths;

@Service
public class CompilerService {
    public CompilerResponse run(RustFile rustFile) {
        String path = Paths.get(rustFile.directory()) + File.separator + rustFile.fileName();
        FileWriter fileToCompile;

        try {
            fileToCompile = new FileWriter(path);
            fileToCompile.write(rustFile.content());
            fileToCompile.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        ProcessBuilder processBuilder = new ProcessBuilder();
        String[] compileCommand = {"rustc", path, "--out-dir", rustFile.directory()};
        processBuilder.command(compileCommand);
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
            File fileExecutable = new File(path.split("\\.")[0] + ".exe");

            if (!fileExecutable.exists()) {
                FileUtils.cleanDirectory(new File(rustFile.directory()));
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
        processBuilder.command(path.split("\\.")[0] + ".exe");

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                actualOutput.append(line);
                actualOutput.append("\n");
            }

            process.waitFor();
            FileUtils.cleanDirectory(new File(rustFile.directory()));
            createFileGitKeep(rustFile.directory());

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return CompilerResponse.builder()
                .status(getStatus(compilerMessage))
                .compilerMessage(compilerMessage.toString())
                .actualOutput(actualOutput.toString())
                .build();
    }
    public CompilerResponse runTests(RustTestFile rustFile) {
        String path = Paths.get(rustFile.directory()) + File.separator + rustFile.fileName();
        FileWriter fileToCompile;

        try {
            fileToCompile = new FileWriter(path);
            fileToCompile.write("mod tests {"); // wrap
            fileToCompile.write(rustFile.content());
            fileToCompile.write(rustFile.testContent()); // tests
            fileToCompile.write("}"); // wrap
            fileToCompile.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        ProcessBuilder processBuilder = new ProcessBuilder();
        String[] compileCommand = {"rustc", path, "--out-dir", rustFile.directory(), "--test"};
        processBuilder.command(compileCommand);
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
            File fileExecutable = new File(path.split("\\.")[0] + ".exe");

            if (!fileExecutable.exists()) {
                FileUtils.cleanDirectory(new File(rustFile.directory()));
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
        processBuilder.command(path.split("\\.")[0] + ".exe");

        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                actualOutput.append(line);
                actualOutput.append("\n");
            }

            process.waitFor();
            FileUtils.cleanDirectory(new File(rustFile.directory()));
            createFileGitKeep(rustFile.directory());

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return CompilerResponse.builder()
                .status(getStatus(compilerMessage))
                .compilerMessage(compilerMessage.toString())
                .actualOutput(actualOutput.toString())
                .build();
    }

    private void createFileGitKeep(String directory) {
        try {
            File gitKeep = new File(directory + "\\" + ".gitkeep");
            if (gitKeep.createNewFile()) {
                System.out.println("File .gitkeep created.");
            }
        } catch(IOException exception){
            System.err.println("Error: Cannot create .gitkeep file.");
        }
    }

    private Status getStatus(StringBuilder message) {
        if (message.isEmpty()) {
            return Status.NORMAL;
        } else {
            return Status.WARNINGS;
        }
    }
}
