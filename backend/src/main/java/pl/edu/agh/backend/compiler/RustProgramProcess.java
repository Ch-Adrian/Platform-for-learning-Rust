package pl.edu.agh.backend.compiler;

import org.apache.commons.io.FileUtils;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import pl.edu.agh.backend.configurations.CompilerConfiguration;
import pl.edu.agh.backend.configurations.CompilerResponseConfig;
import pl.edu.agh.backend.exceptions.CompilerErrorException;

import java.io.*;
import java.util.Objects;


public class RustProgramProcess {

    private final CompilerResponseConfig compilerResponseConfig;
    private final RustFile rustFile;
    private final ProcessBuilder processBuilder;
    private final StringBuilder compilerMessage;
    private String exeEnding = ".exe";

    public RustProgramProcess(RustFile rustFile) {
        this.compilerResponseConfig = new AnnotationConfigApplicationContext(CompilerConfiguration.class).getBean(CompilerResponseConfig.class);
        if (Objects.equals(System.getProperty("os.name"), "Linux")) {
            this.exeEnding = "";
        }
        this.processBuilder = new ProcessBuilder();
        this.compilerMessage = new StringBuilder();
        this.rustFile = rustFile;
    }

    private void compileProgram() throws CompilerErrorException, IOException, InterruptedException {
        processBuilder.command(rustFile.getCommand());

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String line;

        while ((line = reader.readLine()) != null) {
            System.out.println(line);
            this.compilerMessage.append(line);
            this.compilerMessage.append("\n");
        }

        process.waitFor();
        File fileExecutable = new File(rustFile.getPath().split("\\.")[0] + exeEnding);


        if (!fileExecutable.exists()) {
            throw new CompilerErrorException(rustFile.getFileName(), this.compilerMessage.toString());
        }

    }

    private CompilationResponse runProgram() throws IOException, InterruptedException {
        processBuilder.command(rustFile.getPath().split("\\.")[0] + exeEnding);

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        StringBuilder programOutput = new StringBuilder();

        while ((line = reader.readLine()) != null) {
            programOutput.append(line);
            programOutput.append("\n");
        }

        process.waitFor();
        FileUtils.cleanDirectory(new File(rustFile.getDirectory()));
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
            this.cleanWorkingDir();
        }
    }

    private void writeContentToFile(RustFile rustFile) throws IOException {
        FileWriter fileWriter = new FileWriter(rustFile.getPath());
        for (String batch : rustFile.getContentToWrite()) {
            fileWriter.write(batch);
        }
        fileWriter.close();
    }

    private void cleanWorkingDir() {
        try {
            FileUtils.cleanDirectory(new File(rustFile.getDirectory()));
        } catch (IOException | IllegalArgumentException e) {
            e.printStackTrace();
        }
        this.createFileGitKeep(rustFile.getDirectory());
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
