const { GraphQLClient } = require('graphql-request');
const config = require('../config');

class SaleorService {
  constructor() {
    this.client = new GraphQLClient(config.saleor.apiUrl, {
      headers: {
        Authorization: `Bearer ${config.saleor.channelToken}`,
      },
    });
  }

  async getProducts(first = 20) {
    const query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              name
              description
              slug
              pricing {
                priceRange {
                  start {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.client.request(query, { first });
  }

  async getProductById(id) {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          description
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    `;

    return await this.client.request(query, { id });
  }

  async createCheckout(email, lines) {
    const mutation = `
      mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!) {
        checkoutCreate(input: { email: $email, lines: $lines }) {
          checkout {
            id
            token
          }
          errors {
            field
            message
          }
        }
      }
    `;

    return await this.client.request(mutation, { email, lines });
  }

  async completeOrder(checkoutId) {
    const mutation = `
      mutation CreateOrder($checkoutId: ID!) {
        checkoutComplete(checkoutId: $checkoutId) {
          order {
            id
            token
            total {
              gross {
                amount
                currency
              }
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    return await this.client.request(mutation, { checkoutId });
  }
}

module.exports = new SaleorService();