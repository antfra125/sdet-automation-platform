
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('GET /api/products returns products', async ({ request }) => {
  const response = await request.get('/api/products');

  expect(response.status()).toBe(200);

  const products = await response.json();

  expect(Array.isArray(products)).toBe(true);
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


test('POST /api/products should accept price and stock equal to zero', async ({ request }) => {
  const response = await request.post('/api/products', {
    data: {
      name: 'Boundary Test Product',
      price: 0,
      stock: 0
    }
  });

  expect(response.status()).toBe(201);

  const product = await response.json();

  expect(product.price).toBe(0);
  expect(product.stock).toBe(0);

  const deleteResponse = await request.delete(`/api/products/${product.id}`);
  expect(deleteResponse.status()).toBe(204);
});

const invalidProducts = [
  { name: 'Negative price', data: { name: 'Test', price: -1, stock: 10 } },
  { name: 'Negative stock', data: { name: 'Test', price: 100, stock: -1 } },
  { name: 'Empty name', data: { name: '', price: 100, stock: 10 } },
  { name: 'Decimal price', data: { name: 'Test', price: 12.5, stock: 10 } },
  { name: 'String price', data: { name: 'Test', price: 'hello', stock: 10 } },
  { name: 'Missing stock', data: { name: 'Test', price: 100 } }
];

for (const product of invalidProducts) {
  test(`POST /api/products rejects ${product.name}`, async ({ request }) => {
    const response = await request.post('/api/products', {
      data: product.data
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Invalid product data');
  });
}


test('POST /api/products returns correct product structure', async ({ request }) => {
  const response = await request.post('/api/products', {
    data: {
      name: 'Contract Test Product',
      price: 499,
      stock: 5
    }
  });

  expect(response.status()).toBe(201);

  const product = await response.json();

  try {
    expect(product).toEqual({
      id: expect.any(Number),
      name: 'Contract Test Product',
      price: 499,
      stock: 5
    });

    expect(Number.isInteger(product.id)).toBe(true);
    expect(product.id).toBeGreaterThan(0);
  } finally {
    if (Number.isInteger(product.id) && product.id > 0) {
      const deleteResponse = await request.delete(`/api/products/${product.id}`);
      expect(deleteResponse.status()).toBe(204);
    }
  }
});

