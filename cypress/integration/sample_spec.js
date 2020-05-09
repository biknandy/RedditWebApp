import Chance from 'chance';
const chance = new Chance;
describe('My First Test', () => {

  const randomText = chance.string({length: 5})

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

  it('Test if search filters', () => {
    cy.get('input').type(randomText);
  })

  //check if all elements = 15
  it('Check Local Storage', () => {
    cy.get('.heart').click({multiple: true}).should(() => {
      expect(JSON.parse(localStorage.getItem('fav')).length).to.eq(15)
    })
  })

  //tests for favorite bars

  //tests for heart then refresh

})
