import '../support/commands';

const newLessonButton = '[data-cy="new-lesson-button"]';
const lessonSection = '[data-cy="lesson-section"]';
const lessonPage = '[data-cy="lesson-page-container"]';
const lessonName = '[data-cy="lesson-name"]';
const backButton = '[data-cy="back-button"]';
const deleteLessonsButton = '[data-cy="delete-lessons-button"]';

Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').as('consoleError')
});

describe('Home Page lesson management', () => {
  it('should create and open a new lesson on create lesson button', () => {
    cy.visit('/')
    cy.get(newLessonButton).click();
    cy.get(lessonPage).should('exist');
    cy.get(lessonPage).find(lessonSection).should('have.length', 1);
  })

  it('should display error on loading invalid lesson file', () => {
    cy.on('uncaught:exception', (err, runnable) => {
       return false
       })

    cy.visit('/')
    cy.get('[data-cy="upload-lesson-button"]')
      .attachFile('invalid_lesson.json');
    cy.get('@consoleError').should('be.calledOnce')
  })

  it('should open a lesson from the list', () => {
    cy.visit('/')
    cy.contains('CypressTestLesson.json').click()
    cy.get(lessonPage).should('exist');
    cy.get(lessonPage).find(lessonSection).should('have.length', 1);
    cy.get(lessonName).should('have.text', 'CypressTestLesson')
  })

  it('should delete selected lesson', () => {
    // First, create a lesson, and save it
    cy.visit('/')
    cy.get(newLessonButton).click();
    // Set name
    cy.get(lessonName).clear().type('ToDelete', {force: true});
    // Go to starting page
    cy.get(backButton).click();
    cy.contains('Tak').click();
    
    cy.contains("ToDelete.json").parent().find('[data-cy="list-checkbox"]').check();
    cy.get(deleteLessonsButton).click();

    cy.contains('ToDelete.json').should('not.exist');
  })


})