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

describe('Opened lesson structure management', () => {
  it.skip('should add a page on clicking \'Dodaj stronę\' button', () => {
    let pagesBefore = 0;
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    
    cy.wait(1000);
    cy.get(hamburger).click();
    cy.get(lessonNavigation).children().then(($children) => {
        pagesBefore = $children.length;

        cy.get(addPageButton).click();
        cy.get(lessonNavigation).children().should('have.length', pagesBefore + 1);
    });
  })

  it.skip('should delete a page on clicking \'Usuń stronę\' button', () => {
    let pagesBefore = 0;
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(hamburger).click();
    cy.get(addPageButton).click();
    cy.get(lessonNavigation).children().then(($children) => {
        pagesBefore = $children.length;

        cy.get(removePageButton).click();
        cy.get(lessonNavigation).children().should('have.length', pagesBefore - 1);
    });
  })

  it.skip('should add a section on \'Dodaj sekcję\' button', () => {
    let sectionsBefore = 0;
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).then(($sections) => {
      sectionsBefore = $sections.length;

      cy.get(addSectionButton).first().click({ force: true })
      cy.get(section).should('have.length', sectionsBefore + 1);
    })
  })

  it.skip('should remove a section on section thrash button', () => {
    let sectionsBefore = 0;
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).then(($sections) => {
      sectionsBefore = $sections.length;

      cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
      cy.get(section).should('have.length', sectionsBefore - 1);
    })
  })

  it.skip('should add a text cell on \'add cell\' dropdown button menu click', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    cy.get(addSectionButton).first().click({ force: true })
    cy.get(section).find(addCellButton).find('button')
    .click({force: true});
    cy.contains('Tekst').click({force: true});

    const newCell = cy.get(textCell).first().dblclick();
    newCell.find('textarea').clear({force: true}).type('test text', {force: true});
    newCell.blur();


    cy.get(cell).should('have.length', 1);
    cy.get(textCell).should('have.length', 1);
    cy.get(textCell).first().should('have.text', 'test text');
  })

  it.skip('should add a code cell on \'add cell\' dropdown button menu click', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    cy.get(addSectionButton).first().click({ force: true })
    cy.get(section).find(addCellButton).find('button')
    .click({force: true});
    cy.contains('Kod').click({force: true});

    cy.get(codeCell).find('.monaco-editor').first().click()
                    .focused().clear({force: true}).type("test text", {force: true}).blur();

    cy.get(cell).should('have.length', 1);
    cy.get(codeCell).should('have.length', 1);
    cy.get(codeCell).first().find('.monaco-editor').first().contains('test text');
  })

  it.skip('should add a immutable code cell on \'add cell\' dropdown button menu click', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    cy.get(addSectionButton).first().click({ force: true })
    cy.get(section).find(addCellButton).find('button')
    .click({force: true});
    cy.contains('Niemutowalny').click({force: true});

    cy.get(immutableCodeCell).find('.monaco-editor').eq(1).click()
                    .focused().clear({force: true}).type("test text", {force: true}).blur();


    cy.get(cell).should('have.length', 1);
    cy.get(immutableCodeCell).should('have.length', 1);
    cy.get(immutableCodeCell).first().find('.monaco-editor').eq(1).contains('test text');
  })

  it.skip('should delete a cell on clicking thrash icon', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    cy.get(addSectionButton).first().click({ force: true })
    cy.get(section).find(addCellButton).find('button')
                   .click({force: true});  
    
    cy.contains('Tekst').click({force: true});         
    cy.contains('Kod').click({force: true}); 
    cy.contains('Niemutowalny').click({force: true});           



    cy.get(cell).should('have.length', 3);
    cy.get(immutableCodeCell).should('have.length', 1);
    cy.get(codeCell).should('have.length', 1);
    cy.get(textCell).should('have.length', 1);

    cy.get(codeCell).parent().find('[data-cy="cell-delete-button"]').click({ force: true });
    cy.get(codeCell).should('not.exist');
    cy.get(cell).should('have.length', 2);

    cy.get(textCell).parent().find('[data-cy="cell-delete-button"]').click({ force: true });
    cy.get(textCell).should('not.exist');
    cy.get(cell).should('have.length', 1);

    cy.get(immutableCodeCell).parent().find('[data-cy="cell-delete-button"]').click({ force: true });
    cy.get(immutableCodeCell).should('not.exist');
    cy.get(cell).should('have.length', 0);
  })

  it.skip('should rearrange the sequence of cells by drag`n drop', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    cy.get(addSectionButton).first().click({ force: true })
    cy.get(section).find(addCellButton).find('button')
                   .click({force: true});  
    
    cy.contains('Tekst').click({force: true});         
    cy.contains('Kod').click({force: true}); 
    cy.contains('Niemutowalny').click({force: true});

    cy.get(cell).eq(0).should('contain.html', 'data-cy="immutable-code-cell"');
    cy.get(cell).eq(1).should('contain.html', 'data-cy="code-cell"');
    cy.get(cell).eq(2).should('contain.html', 'data-cy="text-cell"');
    
    cy.wait(200);
    cy.dragAndDrop(cellDragIcon, cell, 2, 0);

    cy.get(cell).eq(0).should('contain.html', 'data-cy="text-cell"');
    cy.get(cell).eq(1).should('contain.html', 'data-cy="immutable-code-cell"');
    cy.get(cell).eq(2).should('contain.html', 'data-cy="code-cell"');

    cy.dragAndDrop(cellDragIcon, cell, 1, 2);

    cy.get(cell).eq(0).should('contain.html', 'data-cy="text-cell"');
    cy.get(cell).eq(1).should('contain.html', 'data-cy="code-cell"');
    cy.get(cell).eq(2).should('contain.html', 'data-cy="immutable-code-cell"');
  })

  it.skip('should rearrange the sequence of sections by drag`n drop', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();
    cy.wait(1000);
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true });
    // Create two empty sections
    cy.get(addSectionButton).first()
                          .click({ force: true })
                          .wait(200)
                          .click({force: true});

    cy.wait(200);

    // Give sections ids
    cy.get(section).first().find('[data-cy="section-name"]')
                  .click()
                  .clear({force: true})
                  .type("1", {force: true})
                  .blur(); 
    
    cy.get(section).last().find('[data-cy="section-name"]')
                  .click()
                  .clear({force: true})
                  .type("2", {force: true})
                  .blur(); 

    
    cy.wait(200);
    cy.dragAndDrop(sectionDragIcon, section, 0, 1);
    cy.wait(650);
    cy.get(section).eq(0).should('contain', '2');
    cy.get(section).eq(1).should('contain', '1');

  })

  it('should move a cell to an other section by drag`n drop', () => {
    cy.visit('/')
    cy.contains("CypressTestLesson.json").click();

    // Wait untill page is fully loaded
    cy.get('.monaco-scrollable-element', { timeout: 30000 });
    
    cy.get(section).first().find('[data-cy="section-delete-button"]').click({ force: true })

    // Create two empty sections
    cy.get(addSectionButton).first()
                          .click({ force: true })
                          .wait(200)
                          .click({force: true})
                          .wait(200);

    

    // Create a text cell in the first section
    cy.get(section).first()
                   .find(addCellButton)
                   .find('button')
                   .click({force: true});  

    cy.contains('Tekst').click({force: true});
    
    cy.get(section).eq(0).find(cell).should('have.length', 1);
    cy.get(section).eq(1).find(cell).should('have.length', 0);
    cy.wait(200);
    cy.dragAndDrop(cellDragIcon, addCellButton, 0, 2);
    cy.wait(650);
    cy.get(section).eq(0).find(cell).should('have.length', 0);
    cy.get(section).eq(1).find(cell).should('have.length', 1);

  })

})