describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://app.localhost')
    cy.get('.btn').contains("S'inscrire").click()
    cy.get('.signup__email').type('test4@test.fr')
    cy.get('.signup__username').type('test')
    cy.get('.signup__password').type('**1651P8sSW0rd')
    cy.get('.signup__password-confirmation').type('**1651P8sSW0rd')
    cy.get('.btn').contains("Créer son compte").click()
     cy.get('.btn').contains("Se connecter").click()
    cy.get('.signin__email').type('test2@test.fr')
    cy.get('.signin__password').type('**1651P8sSW0rd')
    cy.get('.btn').contains("Se connecter").click()
  })
})

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://app.localhost')
    cy.get('.btn').contains("Se connecter").click()
    cy.get('.signin__email').type('test4@test.fr')
    cy.get('.signin__password').type('**1651P8sSW0rd')
    cy.get('.btn').contains("Se connecter").click()
  })
})
