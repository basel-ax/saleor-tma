import { GraphQLClient } from 'graphql-request';
import config from '../config/index.js';

export async function checkConnection(): Promise<boolean> {
  try {
    const client = new GraphQLClient(config.saleor.apiUrl, {
      headers: {
        Authorization: `Bearer ${config.saleor.channelToken}`,
      },
    });
    
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
    
    await client.request(query);
    return true;
  } catch (error) {
    return false;
  }
}