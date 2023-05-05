package pl.edu.agh.backend.services;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.RustTestFile;
import pl.edu.agh.backend.compiler.CompilerResponse;

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
        StringBuilder output = new StringBuilder();
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            // StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                output.append(line);
                output.append("\n");
            }
            process.waitFor();
            // if (!output.isEmpty()) {
            //     FileUtils.cleanDirectory(new File(rustFile.directory()));
            //     return new CompilerResponse(1, output.toString());
            // }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        String outputFile = rustFile.fileName().split("\\.")[0] + ".exe";
        processBuilder.command(Paths.get(rustFile.directory()) + File.separator + outputFile);
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            // StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
                output.append("\n");
            }
            process.waitFor();
            FileUtils.cleanDirectory(new File(rustFile.directory()));
            this.createFileGitKeep(rustFile.directory());

            // return new CompilerResponse(0, output.toString());
        } catch (IOException e) {
            e.printStackTrace();
            return new CompilerResponse(1, output.toString());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return new CompilerResponse(0, output.toString());
    }

    public CompilerResponse runTests(RustTestFile rustTestFile) {
        String path = Paths.get(rustTestFile.directory()) + File.separator + rustTestFile.fileName();
        FileWriter fileToCompile;
        try {
            fileToCompile = new FileWriter(path);
            fileToCompile.write("mod tests {");
            fileToCompile.write(rustTestFile.content());
            fileToCompile.write(rustTestFile.testContent());
            fileToCompile.write("}");
            fileToCompile.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        ProcessBuilder processBuilder = new ProcessBuilder();

        String[] compileCommand = {"rustc", path, "--out-dir", rustTestFile.directory(), "--test"};
        processBuilder.command(compileCommand);
        StringBuilder output = new StringBuilder();
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                output.append(line);
                output.append("\n");
            }
            process.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        String outputFile = rustTestFile.fileName().split("\\.")[0] + ".exe";
        processBuilder.command(Paths.get(rustTestFile.directory()) + File.separator + outputFile);
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
                output.append("\n");
            }
            process.waitFor();
            FileUtils.cleanDirectory(new File(rustTestFile.directory()));
            this.createFileGitKeep(rustTestFile.directory());

        } catch (IOException e) {
            e.printStackTrace();
            return new CompilerResponse(1, output.toString());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return new CompilerResponse(0, output.toString());
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
}
