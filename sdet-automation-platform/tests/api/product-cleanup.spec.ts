
import { test, expect } from '../fixtures';

test('should remove a product from PostgreSQL after DELETE', async ({
  request,
  db
}) => {
  // Create a product
  const createResponse = await request.post('/api/products', {
    data: {
      name: 'Cleanup Test Product',
      price: 499,
      stock: 5
    }
  });

  expect(createResponse.status()).toBe(201);

  const product = await createResponse.json();

  try {
    // Delete the product
    const deleteResponse = await request.delete(
      `/api/products/${product.id}`
    );

    expect(deleteResponse.status()).toBe(204);

    // Verify the product no longer exists in PostgreSQL
    const result = await db.query(
      'SELECT id FROM products WHERE id = $1',
      [product.id]
    );

    expect(result.rows).toHaveLength(0);
  } finally {
    // Attempt cleanup if an earlier assertion failed
    await request.delete(`/api/products/${product.id}`);
  }
});
