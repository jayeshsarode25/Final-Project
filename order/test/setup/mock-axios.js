// Simple axios mock for tests: intercepts GET /api/cart and GET /api/products/:id
const axios = require('axios');

const originalGet = axios.get.bind(axios);

axios.get = async function (url, config) {
  if (typeof url === 'string' && url.includes('/api/cart')) {
    return {
      data: {
        cart: {
          items: [
            { productId: '000000000000000000000011', quantity: 2 },
            { productId: '000000000000000000000012', quantity: 1 }
          ]
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // Mock product service responses expected by controller: productResponse.data.data
  const productMatch = url.match(/\/api\/products\/(.+)$/);
  if (productMatch) {
    const id = productMatch[1];
    // simple product fixtures
    const fixtures = {
      '000000000000000000000011': {
        _id: '000000000000000000000011',
        title: 'Product 11',
        stock: 10,
        price: { amount: 10.5, currency: 'USD' }
      },
      '000000000000000000000012': {
        _id: '000000000000000000000012',
        title: 'Product 12',
        stock: 5,
        price: { amount: 5, currency: 'USD' }
      }
    };

    const prod = fixtures[id] || {
      _id: id,
      title: `Product ${id}`,
      stock: 100,
      price: { amount: 1, currency: 'USD' }
    };

    return {
      data: {
        data: prod
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  return originalGet(url, config);
};
