package pl.edu.agh.backend.compiler;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CompilationResponse {

    private Status status;

    private String compilerMessage;

    private String programOutput;

    private String testsOutput;

    private String compilationError;

    private String getError() {
        if (this.compilationError != null && !this.compilationError.isEmpty())
            return String.format("### **Compilation error:** \n%s\n", this.compilationError);
        return "";
    }

    private String getOutput() {
        StringBuilder stringBuilder = new StringBuilder("\n### **Compiled successfully**\n");
        if (this.compilerMessage != null && !this.compilerMessage.isEmpty()) {
            stringBuilder.append(String.format("### **Compiler message:**\n%s\n", this.compilerMessage));
        }
        if (this.programOutput != null && !this.programOutput.isEmpty()) {
            stringBuilder.append(this.programOutput);
        }
        if (this.testsOutput != null && !this.testsOutput.isEmpty()) {
            stringBuilder.append(String.format("\n### **Tests output:**\n%s\n", this.testsOutput));
        }
        return stringBuilder.toString();
    }

    public String getAll() {
        if (this.status.equals(Status.ERROR)) {
            return this.getError();
        } else {
            return this.getOutput();
        }
    }

}
