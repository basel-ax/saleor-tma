import { GraphQLClient } from 'graphql-request';
import config from '../config/index.js';
class SaleorService {
    constructor() {
        this.client = new GraphQLClient(config.saleor.apiUrl, {
            headers: {
                Authorization: `Bearer ${config.saleor.channelToken}`,
            },
        });
    }
    async getShops() {
        const query = `
      query GetShops {
        shops(first: 20) {
          edges {
            node {
              id
              name
              description
              slug
            }
          }
        }
      }
    `;
        return await this.client.request(query);
    }
    async getProducts(first = 20, shopId) {
        const query = `
      query GetProducts($first: Int!, $filter: ProductFilterInput) {
        products(first: $first, filter: $filter) {
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
        const filter = shopId ? { products: { shop: shopId } } : undefined;
        return await this.client.request(query, { first, filter });
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
    async checkConnection() {
        try {
            const query = `
        query Ping {
          shops(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;
            await this.client.request(query);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
export const saleorService = new SaleorService();
export default saleorService;
