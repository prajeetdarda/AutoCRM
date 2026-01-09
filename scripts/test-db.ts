import { seedDatabase } from '../lib/db/seed';
import db from '../lib/db/client';

console.log('🌱 Seeding database...');
seedDatabase();

console.log('\n📊 Testing queries...\n');

const users = db.prepare('SELECT * FROM users').all();
console.log('Users:', users);

const orders = db.prepare('SELECT * FROM orders').all();
console.log('\nOrders:', orders);

const order101 = db.prepare('SELECT * FROM orders WHERE id = ?').get(101);
console.log('\nOrder #101:', order101);

const userWithOrders = db.prepare(`
  SELECT
    u.name,
    u.email,
    u.card_last4,
    o.id as order_id,
    o.status,
    o.amount
  FROM users u
  JOIN orders o ON u.id = o.user_id
  WHERE u.id = 1
`).all();
console.log('\nAlice\'s orders:', userWithOrders);

console.log('\n✅ Database test complete!');
db.close();
