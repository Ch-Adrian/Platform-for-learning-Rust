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

describe('Opened lesson management utilities', () => {
  it('should successfully rename a lesson from list - old name shouldn\'t be visible in the lessons list', () => {
    // First, create a lesson, and save it
    cy.visit('/')
    cy.get(newLessonButton).click();
    // Wait untill page is fully loaded
    cy.contains('Gotowe', {timeout: 20000});
    cy.contains('Loading...').should('not.exist');
    // Set name
    cy.get(lessonName).clear().type('ToRenameOld', {force: true});
    // Go to starting page
    cy.get(backButton).click();
    cy.contains('Tak').click();

    // Now get an already existing lesson
    cy.contains("ToRenameOld").click().wait(650);
    // Wait untill page is fully loaded
    cy.contains('Gotowe', {timeout: 20000});
    cy.contains('Loading...').should('not.exist');
    cy.get(lessonName).clear().type('ToRenameNew', {force: true});
    cy.get(backButton).click().wait(100);
    cy.contains('Tak').click({force: true});

    cy.get('[data-cy="lesson-list"]').contains("ToRenameOld").should('not.exist');
    cy.contains("ToRenameNew").should('exist');
  })

  it('should successfully save a lesson after text cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson").click();
    cy.get(textCell).first().dblclick();
    cy.get(textCell).find('textarea').clear({force: true}).type(curDate, {force: true});
    cy.wait(1000)
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Nie").click();

    cy.contains("CypressTestLesson").click();
    cy.get(textCell).first().should('have.text', curDate);
  })

  it('should successfully save a lesson after code cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson").click();
    cy.get(codeCell).first().find('.monaco-editor').first().click()
                    .focused().clear({force: true}).type(curDate, {force: true});
    cy.wait(1000);
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Tak").click({force: true});

    cy.contains("CypressTestLesson").click();
    cy.get(codeCell).first().find('.monaco-editor').first().should('contain.text', curDate);
  })

  it('should successfully save a lesson after immutable code cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson").click();
    cy.get(immutableCodeCell).first().find('.monaco-editor').last().click()
                             .focused().clear({force: true}).type(curDate, {force: true});
    cy.wait(1000);
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Nie").click();

    cy.contains("CypressTestLesson").click();
    cy.get(immutableCodeCell).first().find('.monaco-editor').last().should('contain.text', curDate);
  })

  it('should fail building a project when a Cargo.toml with error is provided', () => {
    cy.initializeLesson("CypressTestLesson");
    cy.get(configButton).click();
    cy.get(configTextarea).clear({force: true}).type("WRONG VALUE - SHOULD FAIL", {force: true});
    cy.get('[data-cy="config-save-button"]').click();

    cy.contains("Error building project! Check cargo file").should('exist');
  })

  it('should succesfully build a project with a valid Cargo.toml file', () => {
    cy.initializeLesson("CypressTestLesson");
    cy.get(configButton).click();
    cy.get(configTextarea).clear({force: true}).type(defaultCargoToml, {force: true});
    cy.get('[data-cy="config-save-button"]').click();

    cy.contains("Gotowe").should('exist');
  })

  it('should hide lesson content management utilities accessible only to teacher on \'switch mode\' switch', () => {
    cy.initializeLesson("CypressTestLesson");

    cy.get('[data-cy="mode-switch"]').find('.react-switch').click();


    cy.get(addSectionButton).should('have.length', 0);
    cy.get(addCellButton).should('have.length', 0);
    cy.get(cellDragIcon).should('have.length', 0);
    cy.get(sectionDragIcon).should('have.length', 0);
    cy.get(moveItemToPageIcon).should('have.length', 0);

    cy.get('[data-cy="mode-switch"]').find('.react-switch').click();
    cy.get(addSectionButton).should('have.length', 2);
  })

})