
import { test, expect } from '../fixtures';

test('should persist a product in PostgreSQL', async ({
  testProduct,
  db
}) => {
  const result = await db.query(
    `SELECT id, name, price, stock
     FROM products
     WHERE id = $1`,
    [testProduct.id]
  );

  expect(result.rows).toHaveLength(1);

  expect(result.rows[0]).toMatchObject({
    id: testProduct.id,
    name: 'Fixture Keyboard',
    price: 799,
    stock: 10
  });
});
