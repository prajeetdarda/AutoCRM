import db, { initializeDatabase } from './client';

export function seedDatabase() {
  initializeDatabase();

  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM users');

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, card_last4)
    VALUES (?, ?, ?, ?)
  `);

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, user_id, status, amount, items)
    VALUES (?, ?, ?, ?, ?)
  `);

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', card_last4: '4242' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', card_last4: '5555' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', card_last4: '7890' },
  ];

  const orders = [
    {
      id: 101,
      user_id: 1,
      status: 'shipped',
      amount: 29.99,
      items: JSON.stringify([{ name: 'Wireless Mouse', qty: 1 }])
    },
    {
      id: 102,
      user_id: 2,
      status: 'delivered',
      amount: 89.50,
      items: JSON.stringify([{ name: 'Keyboard', qty: 1 }, { name: 'Mouse Pad', qty: 2 }])
    },
    {
      id: 103,
      user_id: 3,
      status: 'processing',
      amount: 599.99,
      items: JSON.stringify([{ name: 'Laptop Stand', qty: 1 }, { name: 'USB-C Hub', qty: 1 }])
    },
    {
      id: 104,
      user_id: 1,
      status: 'delivered',
      amount: 45.00,
      items: JSON.stringify([{ name: 'Webcam', qty: 1 }])
    },
  ];

  users.forEach(user => {
    insertUser.run(user.id, user.name, user.email, user.card_last4);
  });

  orders.forEach(order => {
    insertOrder.run(order.id, order.user_id, order.status, order.amount, order.items);
  });

  console.log('Database seeded successfully!');
}

export function resetDatabase() {
  seedDatabase();
}
