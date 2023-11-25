/// <reference types="Cypress" />
import '../support/commands';

const defaultCargoToml = `[package]
name = "main"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]`;

const newLessonButton = '[data-cy="new-lesson-button"]';
const lessonSection = '[data-cy="lesson-section"]';
const lessonPage = '[data-cy="lesson-page-container"]';
const lessonName = '[data-cy="lesson-name"]';
const backButton = '[data-cy="back-button"]';
const deleteLessonsButton = '[data-cy="delete-lessons-button"]';
const lessonListItem = '[data-cy="list-lesson-item"]';
const textCell = '[data-cy="text-cell"]';
const saveButton = '[data-cy="save-button"]';
const codeCell = '[data-cy="code-cell"]';
const immutableCodeCell = '[data-cy="immutable-code-cell"]';
const configButton = '[data-cy="config-button"]';
const configTextarea = '[data-cy="config-textarea"]';
const addPageButton = '[data-cy="add-page-button"]';
const removePageButton = '[data-cy="remove-page-button"]';
const hamburger = '[data-cy="hamburger"]';
const lessonNavigation = '[data-cy="lesson-navigation"]';
const addSectionButton = '[data-cy="add-section-button"]';
const addCellButton = '[data-cy="add-cell-button"]';
const section = '[data-cy="lesson-section"]';
const cell = '[data-cy="cell"]';
const cellDragIcon = '[data-cy="cell-drag"]';
const sectionDragIcon = '[data-cy="section-drag"]';
const moveItemToPageIcon = '[data-cy="move-item-to-page"]';
const runCodeButton = '[data-cy="code-run-button"]';
const addTestsButton = '[data-cy="add-tests-button"]';
const codeOutput = '[data-cy="code-output"]';
const testOutput = '[data-cy="test-output"]';


describe('Code compilation and execution', () => {
it.skip('should properly compile and execute correct code entered in codeCell with no warnings', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*5
}

fn main() {{}{del}
println!("{}", test_func(5));
}`;

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`);
    cy.get(codeOutput).contains(`25`);
    cy.get(codeOutput).contains(`Compiler message`).should('not.exist');
})

it.skip('should properly compile and execute correct code entered in codeCell with a warning', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*5
}

fn main() {{}{del}
const unused_variable: i8 = 3;
println!("{}", test_func(5));
}`;

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`);
    cy.get(codeOutput).contains(`25`);
    cy.get(codeOutput).contains(`Compiler message`).should('exist');
})

it.skip('should properly compile and execute code that\'s using external crates entered in codeCell', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const validCargoToml = `[package]
name = "main"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
rand = "0.8.4"
log = "0.4"
syn = "2.0"
quote = "1.0"
    `

    const codeValue = `use rand::Rng;
    fn main() {{}{del}
    
        let mut rng = rand::thread_rng();
    
        let n1: u8 = rng.gen();
        let n2: u16 = rng.gen();
        println!("Random u8: {}", n1);
        println!("Random u16: {}", n2);
    }`;

    cy.get(configButton).click();
    cy.get(configTextarea).clear({force: true}).type(validCargoToml, {force: true});
    cy.get('[data-cy="config-save-button"]').click();

    cy.contains('Gotowe', {timeout: 20000});
    cy.contains('Budowanie projektu...').should('not.exist');

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`);
    cy.get(codeOutput).contains(`Compiler message`).should('not.exist');
})

it.skip('should not compile an incorrect code entered in codeCell', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*5
}

fn main() {{}{del}
WRONG_CODE unused_variable: i8 = 3;
println!("{}", test_func(5));
}`;

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`).should('not.exist');
    cy.get(codeOutput).contains(`Compilation error`).should('exist');
})

it.skip('should compile a code entered in the CodeCell but panic at runtime because of division by 0', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*5
}

fn main() {{}{del}
println!("{}", test_func(5)/test_func(0));
}`;

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`).should('exist');
    cy.get(codeOutput).contains(`thread 'main' panicked at 'attempt to divide by zero'`).should('exist');
})

it.skip('should compile and run code entered in the CodeCell as well as all inserted tests must pass', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*x
}

fn main() {{}{del}
println!("{}", test_func(5));
}`;

    const testValue = `#[test]
fn test1() {{}{del}
    let result = 25;
    assert_eq!(result, test_func(5));
}


#[test]
fn test2() {{}{del}
    let result = 0;
    assert_eq!(result, test_func(0));
}

#[test]
fn test3() {{}{del}
    let result = 9;
    assert_eq!(result, test_func(-3));
}`

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});
    
    cy.get(codeCell).first().find('.monaco-editor').eq(1).click()
                .focused().clear({force: true})
                .type(testValue, {force: true});

    cy.wait(650);

    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`).should('exist');
    cy.get(testOutput).contains(`Tests output:`).should('exist');
    cy.get(testOutput).contains(`test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`).should('exist');
})

it.skip('should compile and run code entered in the CodeCell but one test should fail', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*x
}

fn main() {{}{del}
println!("{}", test_func(5));
}`;

    const testValue = `#[test]
fn test1() {{}{del}
let result = 2567995;
assert_eq!(result, test_func(67408));
}


#[test]
fn test2() {{}{del}
    let result = 0;
    assert_eq!(result, test_func(0));
}

#[test]
fn test3() {{}{del}
    let result = 9;
    assert_eq!(result, test_func(-3));
}`

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});
    
    cy.get(codeCell).first().find('.monaco-editor').eq(1).click()
                .focused().clear({force: true})
                .type(testValue, {force: true});

    cy.wait(650);

    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`).should('exist');
    cy.get(testOutput).contains(`Tests output:`).should('exist');
    cy.get(testOutput).contains(`test result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out`).should('exist');
})

it.skip('should pass the tests but fail to compile the plain code in CodeCell', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*x
}

fn main() {{}{del}
println!("{}", test_func(5)/0);
}`;

    const testValue = `#[test]
fn test1() {{}{del}
    let result = 25;
    assert_eq!(result, test_func(5));
}


#[test]
fn test2() {{}{del}
    let result = 0;
    assert_eq!(result, test_func(0));
}

#[test]
fn test3() {{}{del}
    let result = 9;
    assert_eq!(result, test_func(-3));
}`

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});
    
    cy.get(codeCell).first().find('.monaco-editor').eq(1).click()
                .focused().clear({force: true})
                .type(testValue, {force: true});

    cy.wait(650);

    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compilation error`).should('exist');
    cy.get(testOutput).contains(`Tests output:`).should('exist');
    cy.get(testOutput).contains(`test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`).should('exist');
})

it.skip('should correctly compile and run a code but shoudln\'t compile tests', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `fn test_func(x: i32) -> i32 {{}{del}
x*x
}

fn main() {{}{del}
println!("{}", test_func(5));
}`;

    const testValue = `#[test]
fn test1() {{}{del}
    let result = 25;
    WRONG_CODE
    assert_eq!(result, test_func(5));
}


#[test]
fn test2() {{}{del}
    let result = 0;
    assert_eq!(result, test_func(0));
}

#[test]
fn test3() {{}{del}
    let result = 9;
    assert_eq!(result, test_func(-3));
}`

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});
    
    cy.get(codeCell).first().find('.monaco-editor').eq(1).click()
                .focused().clear({force: true})
                .type(testValue, {force: true});

    cy.wait(650);

    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compiled successfully`).should('exist');
    cy.get(testOutput).contains(`Compilation error`).should('exist');
})

it.skip('should fail to compile due to missing dependencies in Cargo.toml', () => {
    cy.initializeLesson("CypressTestLesson.json");

    const codeValue = `use rand::Rng;
    fn main() {{}{del}
    
        let mut rng = rand::thread_rng();
    
        let n1: u8 = rng.gen();
        let n2: u16 = rng.gen();
        println!("Random u8: {}", n1);
        println!("Random u16: {}", n2);
    }`;

    cy.get(codeCell).first().find('.monaco-editor').first().click()
                .focused().clear({force: true})
                .type(codeValue, {force: true});

    
    cy.get(codeCell).first().parent().find(runCodeButton).click();

    cy.get(codeOutput).contains(`Compilation error`).should('exist');
    cy.get(codeOutput).contains(`unresolved import rand`).should('exist');
    cy.get(codeOutput).contains(` failed to resolve: use of undeclared crate or module rand`).should('exist');
    
})

})