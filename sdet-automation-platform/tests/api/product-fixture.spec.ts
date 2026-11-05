
import { test, expect } from '../fixtures/product.fixture';

test('should retrieve its own product', async ({
  request,
  testProduct
}) => {
  const response = await request.get(
    `/api/products/${testProduct.id}`
  );

  expect(response.status()).toBe(200);

  const product = await response.json();

  expect(product).toMatchObject({
    id: testProduct.id,
    name: 'Fixture Keyboard',
    price: 799,
    stock: 10
  });
});
