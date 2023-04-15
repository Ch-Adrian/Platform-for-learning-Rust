package pl.edu.agh.backend.compiler;

import org.apache.commons.io.FileUtils;
import java.io.*;
import java.nio.file.Paths;

public class RustCompiler {
    public RustOutput run(RustFile rustFile) {
        String path = Paths.get(rustFile.directory()) + File.separator + rustFile.fileName();
        FileWriter fileToCompile;
        try {
            fileToCompile = new FileWriter(path);
            fileToCompile.write(rustFile.code());
            fileToCompile.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        ProcessBuilder processBuilder = new ProcessBuilder();

        String[] compileCommand = {"rustc", path, "--out-dir", rustFile.directory()};
        processBuilder.command(compileCommand);
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                output.append(line);
            }
            process.waitFor();
            if (!output.isEmpty()) {
                FileUtils.cleanDirectory(new File(rustFile.directory()));
                return new RustOutput(1, output.toString());
            }
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
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();
            FileUtils.cleanDirectory(new File(rustFile.directory()));
            return new RustOutput(0, output.toString());
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return new RustOutput(1, "");
    }
}
