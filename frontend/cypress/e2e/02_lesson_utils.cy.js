import '../support/commands';

const newLessonButton = '[data-cy="new-lesson-button"]';
const lessonSection = '[data-cy="lesson-section"]';
const lessonPage = '[data-cy="lesson-page-container"]';
const lessonName = '[data-cy="lesson-name"]';
const backButton = '[data-cy="back-button"]';
const deleteLessonsButton = '[data-cy="delete-lessons-button"]';
const lessonListItem = '[data-cy="list-lesson-item"]';

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
})