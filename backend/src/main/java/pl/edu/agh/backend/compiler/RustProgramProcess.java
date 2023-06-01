package pl.edu.agh.backend.compiler;

import org.apache.catalina.core.ApplicationContext;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.stereotype.Component;
import pl.edu.agh.backend.configurations.CompilerConfiguration;
import pl.edu.agh.backend.configurations.CompilerResponseConfig;
import pl.edu.agh.backend.exceptions.CompilerErrorException;

import java.io.*;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;


public class RustProgramProcess{

    private CompilerResponseConfig compilerResponseConfig;
    private RustFile rustFile;
    private String path;
    private ProcessBuilder processBuilder;
    private StringBuilder compilerMessage;
    private StringBuilder programOutput;
    private String exeEnding = ".exe";

    public RustProgramProcess(RustFile rustFile){
        this.compilerResponseConfig = new AnnotationConfigApplicationContext(CompilerConfiguration.class).getBean(CompilerResponseConfig.class);
        if (Objects.equals(System.getProperty("os.name"), "Linux")){
            this.exeEnding = "";
        }
        this.processBuilder = new ProcessBuilder();
        this.compilerMessage = new StringBuilder();
        this.programOutput = new StringBuilder();
        this.rustFile = rustFile;
        this.path = Paths.get(rustFile.getDirectory()) + File.separator + rustFile.getFileName();
    }

    private void compileProgram() throws CompilerErrorException, IOException, InterruptedException{
        processBuilder.command(getCommand(path, rustFile));

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String line;

        while ((line = reader.readLine()) != null) {
            System.out.println(line);
            this.compilerMessage.append(line);
            this.compilerMessage.append("\n");
        }

        process.waitFor();
        File fileExecutable = new File(path.split("\\.")[0] + exeEnding);


        if (!fileExecutable.exists()) {
            throw new CompilerErrorException(rustFile.getFileName(), this.compilerMessage.toString());
        }

    }

    private CompilationResponse runProgram() throws IOException, InterruptedException{
        processBuilder.command(path.split("\\.")[0] + exeEnding);

        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;

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
            this.writeContentToFile(path, rustFile);
            this.compileProgram();
            return this.runProgram();
        } catch (CompilerErrorException ex){
            System.err.println(ex.getMessage());
            return compilerResponseConfig.createError(ex.getMessage());
        } catch (IOException | InterruptedException ex){
            ex.printStackTrace();
            return compilerResponseConfig.createError("Exception occurred during compilation in Java environment.");
        }
        finally{
            this.cleanWorkingDir();
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

    private void cleanWorkingDir(){
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
        } catch(IOException exception){
            System.err.println("Error: Cannot create .gitkeep file.");
        }
    }

}
