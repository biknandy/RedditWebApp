import Chance from 'chance';
const chance = new Chance;
describe('My Tests', () => {

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
  it('Test if search filters', () => {
    cy.get('input').type(randomText);
    cy.get('#cardDeck').children(($elem) => {
      $elem.should('not.be.visibile')
    })
  })

  //check if all elements = 15
  it('Check Local Storage on heart click', () => {
    cy.get('.heart').click({multiple: true}).should(() => {
      expect(JSON.parse(localStorage.getItem('fav')).length).to.eq(15)
    })
  })

  //tests for favorite bar button

  //tests for heart then refresh

})
