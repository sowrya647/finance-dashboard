export const mockTransactions = [
  {
    id: 1,
    date: '2024-03-15',
    description: 'Salary Deposit',
    amount: 5000,
    category: 'Salary',
    type: 'income'
  },
  {
    id: 2,
    date: '2024-03-14',
    description: 'Grocery Shopping',
    amount: 150,
    category: 'Food',
    type: 'expense'
  },
  {
    id: 3,
    date: '2024-03-13',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: 4,
    date: '2024-03-12',
    description: 'Freelance Work',
    amount: 800,
    category: 'Freelance',
    type: 'income'
  },
  {
    id: 5,
    date: '2024-03-11',
    description: 'Restaurant Dinner',
    amount: 85,
    category: 'Food',
    type: 'expense'
  },
  {
    id: 6,
    date: '2024-03-10',
    description: 'Electric Bill',
    amount: 120,
    category: 'Utilities',
    type: 'expense'
  },
  {
    id: 7,
    date: '2024-03-09',
    description: 'Gym Membership',
    amount: 50,
    category: 'Health',
    type: 'expense'
  },
  {
    id: 8,
    date: '2024-03-08',
    description: 'Investment Dividend',
    amount: 200,
    category: 'Investment',
    type: 'income'
  }
];

export const categories = [
  'All',
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Entertainment',
  'Utilities',
  'Health'
];

export const spendingByCategory = {
  'Food': 235,
  'Entertainment': 95.99,
  'Utilities': 120,
  'Health': 50
};

export const monthlyData = [
  { month: 'Jan', balance: 3200, income: 4200, expenses: 1000 },
  { month: 'Feb', balance: 4100, income: 4800, expenses: 700 },
  { month: 'Mar', balance: 4850, income: 5800, expenses: 950 },
  { month: 'Apr', balance: 5200, income: 5000, expenses: 800 },
  { month: 'May', balance: 5900, income: 6200, expenses: 300 },
  { month: 'Jun', balance: 6450, income: 5800, expenses: 350 }
];