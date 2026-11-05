
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('GET /api/products returns products', async ({ request }) => {
  const response = await request.get('/api/products');

  expect(response.status()).toBe(200);

  const products = await response.json();

  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);
});

test('POST /api/products rejects invalid data', async ({ request }) => {
  const response = await request.post('/api/products', {
    data: {
      name: '',
      price: -100,
      stock: 5
    }
  });

  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.error).toBe('Invalid product data');
});

test('should create, verify and delete a product', async ({ request }) => {
  const createResponse = await request.post('/api/products', {
    data: {
      name: 'Test Keyboard',
      price: 799,
      stock: 10
    }
  });

  expect(createResponse.status()).toBe(201);

  const createdProduct = await createResponse.json();
  const productId = createdProduct.id;

  try {
    const getResponse = await request.get('/api/products');
    expect(getResponse.status()).toBe(200);

    const products = await getResponse.json();

    const product = products.find(
      (p: { id: number }) => p.id === productId
    );

    expect(product).toMatchObject({
      name: 'Test Keyboard',
      price: 799,
      stock: 10
    });
  } finally {
    const deleteResponse = await request.delete(
      `/api/products/${productId}`
    );

    expect(deleteResponse.status()).toBe(204);
  }
});
