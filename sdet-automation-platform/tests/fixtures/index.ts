
import { mergeTests, expect } from '@playwright/test';
import { test as productTest } from './product.fixture';
import { test as databaseTest } from './database.fixture';

export const test = mergeTests(productTest, databaseTest);
export { expect };
