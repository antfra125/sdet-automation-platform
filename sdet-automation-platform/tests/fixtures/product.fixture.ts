
import { test as base, expect } from '@playwright/test';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type ProductFixtures = {
  testProduct: Product;
};

export const test = base.extend<ProductFixtures>({
  testProduct: async ({ request }, use) => {
    const response = await request.post('/api/products', {
      data: {
        name: 'Fixture Keyboard',
        price: 799,
        stock: 10
      }
    });

    expect(response.status()).toBe(201);

    const product: Product = await response.json();

    try {
      await use(product);
    } finally {
      const deleteResponse = await request.delete(
        `/api/products/${product.id}`
      );

      expect(deleteResponse.status()).toBe(204);
    }
  }
});

export { expect };
