import Chance from 'chance';
const chance = new Chance;
describe('My Tests', () => {

  //generate random string of 50 chars
  const randomText = chance.string({length: 50})

  //reload before each test
  beforeEach(() =>{
    cy.visit('http://localhost:5000/docs/')
  })

  //check title appears
  it('Title works', () => {
    cy.contains('Reddit WebApp')
  })


  //checks if button opens modal
  it('Test if buttons open modal', () => {
    cy.get('.btn-outline-primary').each(($btn)=> {
      cy.get($btn).click()
      cy.wait(500)
      cy.get('.modal').should('be.visible')
      cy.get("#closeBtn").click()
    })
  })

  //check if search causes hidden elements
  it('Test if search filters and hides elements', () => {
    cy.get('input').type(randomText);
    cy.get('#cardDeck').children(($elem) => {
      $elem.should('not.be.visibile')
    })
  })

  //check if all elements in localStorage = 15
  it('Check Local Storage on heart click', () => {
    cy.get('.heart').click({multiple: true}).should(() => {
      expect(JSON.parse(localStorage.getItem('fav')).length).to.eq(15)
    })
  })

  //tests for heart and sidebar on refresh
  it('Check if favorites persists on refresh', () => {
    cy.get('.heart').click({multiple: true}).should(() => {
      cy.reload()
      cy.get('#favButtons').find('.btn-primary').should('have.length', 15)
      cy.get('.heart').should('have.class', 'fas')
    })
  })

  //check modal opens on click of favorites in sidebar
  it('Check if favorite buttons open modal', () => {
    cy.get('.heart').click({multiple: true});
    cy.get('.fa-bars').click();

    cy.get('#favButtons').find('.btn-md').each(($btn)=> {
      cy.get($btn).click()
      cy.wait(500)
      cy.get('.modal').should('be.visible')
      cy.get("#closeBtn").click()
    })

  })

})
