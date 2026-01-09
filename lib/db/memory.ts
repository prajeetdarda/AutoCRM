// In-memory database implementation for serverless environments
// Mimics better-sqlite3 interface

interface User {
  id: number;
  name: string;
  email: string;
  card_last4: string;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  amount: number;
  items: string;
  created_at?: string;
}

class InMemoryDatabase {
  private users: Map<number, User> = new Map();
  private orders: Map<number, Order> = new Map();
  private initialized = false;

  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (this.initialized) return;

    // Seed with demo data
    const users: User[] = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', card_last4: '4242' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', card_last4: '5555' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com', card_last4: '7890' },
    ];

    const orders: Order[] = [
      {
        id: 101,
        user_id: 1,
        status: 'shipped',
        amount: 29.99,
        items: JSON.stringify([{ name: 'Wireless Mouse', qty: 1 }]),
        created_at: new Date().toISOString(),
      },
      {
        id: 102,
        user_id: 2,
        status: 'delivered',
        amount: 89.50,
        items: JSON.stringify([{ name: 'Keyboard', qty: 1 }, { name: 'Mouse Pad', qty: 2 }]),
        created_at: new Date().toISOString(),
      },
      {
        id: 103,
        user_id: 3,
        status: 'processing',
        amount: 599.99,
        items: JSON.stringify([{ name: 'Laptop Stand', qty: 1 }, { name: 'USB-C Hub', qty: 1 }]),
        created_at: new Date().toISOString(),
      },
      {
        id: 104,
        user_id: 1,
        status: 'delivered',
        amount: 45.00,
        items: JSON.stringify([{ name: 'Webcam', qty: 1 }]),
        created_at: new Date().toISOString(),
      },
    ];

    users.forEach(user => this.users.set(user.id, user));
    orders.forEach(order => this.orders.set(order.id, order));

    this.initialized = true;
  }

  prepare(query: string) {
    return {
      get: (...params: any[]) => {
        // Handle SELECT queries for single row
        if (query.includes('SELECT * FROM users WHERE id = ?')) {
          const userId = params[0];
          return this.users.get(userId) || null;
        }

        if (query.includes('SELECT * FROM orders WHERE id = ?')) {
          const orderId = params[0];
          return this.orders.get(orderId) || null;
        }

        return null;
      },

      all: (...params: any[]) => {
        // Handle SELECT queries for multiple rows
        if (query.includes('SELECT * FROM orders WHERE user_id = ?')) {
          const userId = params[0];
          return Array.from(this.orders.values()).filter(order => order.user_id === userId);
        }

        return [];
      },

      run: (...params: any[]) => {
        // Handle UPDATE queries
        if (query.includes('UPDATE orders SET status = ? WHERE id = ?')) {
          const [status, orderId] = params;
          const order = this.orders.get(orderId);
          if (order) {
            order.status = status;
            this.orders.set(orderId, order);
          }
          return { changes: order ? 1 : 0 };
        }

        return { changes: 0 };
      },
    };
  }

  // Mimic SQLite pragma (no-op for in-memory)
  pragma(command: string) {
    // No-op for in-memory
  }

  // Mimic SQLite exec (no-op for in-memory)
  exec(sql: string) {
    // No-op for in-memory
  }
}

const memoryDb = new InMemoryDatabase();

export function initializeDatabase() {
  memoryDb.initializeDatabase();
}

export default memoryDb;
