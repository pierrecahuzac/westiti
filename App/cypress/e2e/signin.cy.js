describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://app.localhost')
    cy.get('.btn').contains("Se connecter").click()
    cy.get('.signin__email').type('test@test.fr')
  /*   cy.get('.signin__username').type('test') */
    cy.get('.signin__password').type('**1651P8sSW0rd')
    cy.get('.btn').contains("Se connecter").click()
  })
})

