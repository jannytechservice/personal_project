import { vi } from 'vitest';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '.env') });

// env variables
process.env.AUTH_IDENTITYPOOLID = 'us-east-1:xxxxxxxx-xxxx';
process.env.AUTH_USERPOOLID = 'us-east-1_XXXXXXXX';
process.env.TABLE_CONTACT = 'TABLE_CONTACT';
process.env.TABLE_ENTITY = 'TABLE_ENTITY';
process.env.TABLE_INCREMENT = 'TABLE_INCREMENT';
process.env.TABLE_PAYMENT = 'TABLE_PAYMENT';
process.env.TABLE_PAYMENT_ACCOUNT = 'TABLE_PAYMENT_ACCOUNT';
process.env.TABLE_TASK = 'TABLE_TASK';
process.env.TABLE_USER = 'TABLE_USER';

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
