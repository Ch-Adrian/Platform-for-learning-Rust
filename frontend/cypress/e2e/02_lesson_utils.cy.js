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

describe('Opened lesson management utilities', () => {
  it.skip('should successfully rename a lesson from list - old name shouldn\'t be visible in the lessons list', () => {
    // First, create a lesson, and save it
    cy.visit('/')
    cy.get(newLessonButton).click();
    // Set name
    cy.get(lessonName).clear().type('ToRename', {force: true});
    // Go to starting page
    cy.get(backButton).click();
    cy.contains('Tak').click();

    // Now get an already existing lesson
    cy.contains("ToRename.json").click();
    cy.get(lessonName).clear().type('ToRenameNew', {force: true});
    cy.get(backButton).click();
    cy.contains('Tak').click();

    cy.get('[data-cy="lesson-list"]').contains("ToRename.json").should('not.exist');
    cy.contains("ToRenameNew.json").should('exist');
  })

  it.skip('should successfully save a lesson after text cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.get(textCell).first().dblclick();
    cy.get(textCell).find('textarea').clear({force: true}).type(curDate, {force: true});
    cy.wait(1000)
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Nie").click();

    cy.contains("CypressTestLesson.json").click();
    cy.get(textCell).first().should('have.text', curDate);
  })

  it.skip('should successfully save a lesson after code cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.get(codeCell).first().find('.monaco-editor').first().click()
                    .focused().clear({force: true}).type(curDate, {force: true});
    cy.wait(1000);
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Nie").click();

    cy.contains("CypressTestLesson.json").click();
    cy.get(codeCell).first().find('.monaco-editor').first().should('have.text', curDate);
  })

  it.skip('should successfully save a lesson after immutable code cell modification', () => {
    const curDate = Date.now();

    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.get(immutableCodeCell).first().find('.monaco-editor').last().click()
                             .focused().clear({force: true}).type(curDate, {force: true});
    cy.wait(1000);
    cy.get(saveButton).click();
    cy.get(backButton).click();
    cy.contains("Nie").click();

    cy.contains("CypressTestLesson.json").click();
    cy.get(immutableCodeCell).first().find('.monaco-editor').last().should('have.text', curDate);
  })

  it.skip('should fail building a project when a Cargo.toml with error is provided', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.get(configButton).click();
    cy.get(configTextarea).clear({force: true}).type("WRONG VALUE - SHOULD FAIL", {force: true});
    cy.get('[data-cy="config-save-button"]').click();

    cy.contains("Error building project! Check cargo file").should('exist');
  })

  it.skip('should succesfully build a project with a valid Cargo.toml file', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.get(configButton).click();
    cy.get(configTextarea).clear({force: true}).type(defaultCargoToml, {force: true});
    cy.get('[data-cy="config-save-button"]').click();

    cy.contains("Gotowe").should('exist');
  })

})