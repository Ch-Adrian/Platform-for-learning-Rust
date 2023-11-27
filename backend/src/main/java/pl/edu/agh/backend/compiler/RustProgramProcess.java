package pl.edu.agh.backend.compiler;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import pl.edu.agh.backend.config.CompilerConfiguration;
import pl.edu.agh.backend.config.CompilerResponseConfig;
import pl.edu.agh.backend.exceptions.CompilerErrorException;
import java.io.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class RustProgramProcess {

    private final CompilerResponseConfig compilerResponseConfig;
    private final RustFile rustFile;
    private final ProcessBuilder processBuilder;
    private final StringBuilder compilerMessage;
    private static final Logger logger = LogManager.getLogger();

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
            if (line.startsWith("Compiling") || line.startsWith("Finished") || line.startsWith("Executable unittests")) continue;
            compilerMessage.append(line);
            compilerMessage.append("\n");
            logger.info(line);
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
            logger.info(line);
        }

        reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.startsWith("note")) continue;
            compilerMessage.append(line);
            compilerMessage.append("\n");
            logger.info(line);
        }

        process.waitFor();
        cleanExecutable();
        createFileGitKeep(rustFile.getDirectory());

        return compilerResponseConfig.createResponse(compilerMessage.toString(), programOutput.toString(), rustFile);
    }

    public CompilationResponse runProcess() {
        try {
            this.writeContentToFile(rustFile);
            this.compileProgram();
            return this.runProgram();
        } catch (CompilerErrorException ex) {
            logger.error(ex.getMessage());
            return compilerResponseConfig.createError(ex.getMessage());
        } catch (IOException | InterruptedException ex) {
            logger.error("\n" + ExceptionUtils.getStackTrace(ex));
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
            logger.error(ex.getMessage());
            return compilerResponseConfig.createError(ex.getMessage());
        } catch (IOException | InterruptedException ex) {
            logger.error(ex.getMessage());
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
        File file = new File(rustFile.getExecutablePath());
        if (!file.exists()) return;
        try {
            FileUtils.delete(file);
        } catch (IOException | IllegalArgumentException ex) {
            logger.error(ex.getMessage());
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
                logger.info("File .gitkeep created.");
            }
        } catch (IOException exception) {
            logger.info("Error: Cannot create .gitkeep file.");
        }
    }

}
