package pl.edu.agh.backend.compiler;

import org.apache.commons.io.FileUtils;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import pl.edu.agh.backend.configurations.CompilerConfiguration;
import pl.edu.agh.backend.configurations.CompilerResponseConfig;
import pl.edu.agh.backend.exceptions.CompilerErrorException;

import java.io.*;


public class RustProgramProcess {

    private final CompilerResponseConfig compilerResponseConfig;
    private final RustFile rustFile;
    private final ProcessBuilder processBuilder;
    private final StringBuilder compilerMessage;

    public RustProgramProcess(RustFile rustFile) {
        this.compilerResponseConfig = new AnnotationConfigApplicationContext(CompilerConfiguration.class).getBean(CompilerResponseConfig.class);
        this.processBuilder = new ProcessBuilder();
        this.compilerMessage = new StringBuilder();
        this.rustFile = rustFile;
    }

    private CompilationResponse compileProgram() throws CompilerErrorException, IOException, InterruptedException {
        processBuilder.command(rustFile.getCompilationCommand());

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String line;

        while ((line = reader.readLine()) != null) {
            line = line.trim();
            System.out.println(line);
            if (line.startsWith("Compiling") || line.startsWith("Finished") || line.startsWith("Executable unittests")) continue;
            compilerMessage.append(line);
            compilerMessage.append("\n");
        }

        process.waitFor();


        if (process.exitValue() != 0) {
            throw new CompilerErrorException(rustFile.getCodeFileName(), compilerMessage.toString());
        }

        return compilerResponseConfig.createResponse(compilerMessage.toString(), "", rustFile);
    }

    private CompilationResponse runProgram() throws CompilerErrorException, IOException, InterruptedException {
        processBuilder.command(rustFile.getExecutionCommand());

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        StringBuilder programOutput = new StringBuilder();

        while ((line = reader.readLine()) != null) {
            programOutput.append(line);
            programOutput.append("\n");
        }

        process.waitFor();
        new File(rustFile.getExecutablePath()).delete();
        createFileGitKeep(rustFile.getDirectory());


        return compilerResponseConfig.createResponse(compilerMessage.toString(), programOutput.toString(), rustFile);
    }

    public CompilationResponse runProcess() {
        try {
            this.writeContentToFile(rustFile);
            this.compileProgram();
            return this.runProgram();
        } catch (CompilerErrorException ex) {
            System.err.println(ex.getMessage());
            return compilerResponseConfig.createError(ex.getMessage());
        } catch (IOException | InterruptedException ex) {
            ex.printStackTrace();
            return compilerResponseConfig.createError("Exception occurred during compilation in Java environment.");
        } finally {
            this.cleanExecutable();
        }
    }

    public CompilationResponse buildConfig() {
        try {
            this.writeContentToFile(rustFile);
            this.cleanCodeFile();
            return this.compileProgram();
        } catch (CompilerErrorException ex) {
            System.err.println(ex.getMessage());
            return compilerResponseConfig.createError(ex.getMessage());
        } catch (IOException | InterruptedException ex) {
            ex.printStackTrace();
            return compilerResponseConfig.createError("Exception occurred during compilation in Java environment.");
        } finally {
            this.cleanExecutable();
        }
    }

    private void writeContentToFile(RustFile rustFile) throws IOException {
        FileWriter fileWriter = new FileWriter(rustFile.getPath());
        for (String batch : rustFile.getContentToWrite()) {
            fileWriter.write(batch);
        }
        fileWriter.close();
    }

    private void cleanExecutable() {
        try {
            FileUtils.delete(new File(rustFile.getExecutablePath()));
        } catch (IOException | IllegalArgumentException e) {
            e.printStackTrace();
        }
        this.createFileGitKeep(rustFile.getDirectory());
    }

    private void cleanCodeFile() throws IOException {
        String path = rustFile.getDirectory() + File.separator + "src" + File.separator + rustFile.getCodeFileName();
        String defaultCode = """
                fn main() {
                  //YOUR CODE HERE
                }
                """;
        FileWriter fileWriter = new FileWriter(path);
        fileWriter.write(defaultCode);
        fileWriter.close();

    }


    private void createFileGitKeep(String directory) {
        try {
            File gitKeep = new File(directory + File.separator + ".gitkeep");
            if (gitKeep.createNewFile()) {
                System.out.println("File .gitkeep created.");
            }
        } catch (IOException exception) {
            System.err.println("Error: Cannot create .gitkeep file.");
        }
    }

}
