import { GraphQLClient } from 'graphql-request';
import config from '../config/index.js';
import type { ProductResponse } from '../types/index.js';

class SaleorService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(config.saleor.apiUrl, {
      headers: {
        Authorization: `Bearer ${config.saleor.channelToken}`,
      },
    });
  }

  async getProducts(first: number = 20): Promise<ProductResponse> {
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

    return await this.client.request<ProductResponse>(query, { first });
  }

  async getProductById(id: string) {
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

  async createCheckout(email: string, lines: Array<{ variantId: string; quantity: number }>) {
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

  async completeOrder(checkoutId: string) {
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

export const saleorService = new SaleorService();
export default saleorService;
