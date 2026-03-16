import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = '@rebank_mock_db_v2';

// ── Types ──────────────────────────────────────────────

export type TransactionCategory = 'shopping' | 'food' | 'salary' | 'transfer' | 'bill' | 'international' | 'entertainment' | 'transport';

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  icon: string;
  category: TransactionCategory;
  recipient?: string;
  sender?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface BankCard {
  id: string;
  last4: string;
  fullNumber: string;
  holderName: string;
  expiry: string;
  cvv: string;
  isLocked: boolean;
  limit: number;
  type: 'visa' | 'mastercard';
  balance: number;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings';
  balance: number;
  accountNumber: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  accountNumber: string;
}

export interface Biller {
  id: string;
  name: string;
  icon: string;
  category: 'electricity' | 'internet' | 'streaming' | 'water' | 'insurance';
  amount: number;
  accountId?: string;
  lastPaid?: string;
}

export interface MockData {
  balance: number;
  transactions: Transaction[];
  cards: BankCard[];
  accounts: BankAccount[];
  contacts: Contact[];
  billers: Biller[];
}

// ── Default Seed Data ──────────────────────────────────

const now = Date.now();
const day = 86400000;

const defaultData: MockData = {
  balance: 24562.80,

  accounts: [
    { id: 'acc_checking', name: 'Checking Account', type: 'checking', balance: 18562.80, accountNumber: 'RE-2024-00814' },
    { id: 'acc_savings', name: 'Savings Account', type: 'savings', balance: 6000.00, accountNumber: 'RE-2024-00815' },
  ],

  cards: [
    {
      id: 'card1', last4: '8829', fullNumber: '4539 1234 5678 8829',
      holderName: 'Raouf Sterling', expiry: '09/28', cvv: '314',
      isLocked: false, limit: 5000, type: 'visa', balance: 18562.80,
    },
    {
      id: 'card2', last4: '4417', fullNumber: '5412 7534 9821 4417',
      holderName: 'Raouf Sterling', expiry: '03/27', cvv: '892',
      isLocked: false, limit: 3000, type: 'mastercard', balance: 6000.00,
    },
  ],

  contacts: [
    { id: 'ct1', name: 'Marcus Johnson', email: 'marcus.j@email.com', avatarSeed: 'marcus', accountNumber: 'RE-2024-10201' },
    { id: 'ct2', name: 'Elena Garcia', email: 'elena.g@email.com', avatarSeed: 'elena', accountNumber: 'RE-2024-10202' },
    { id: 'ct3', name: 'Julian Park', email: 'julian.p@email.com', avatarSeed: 'julian', accountNumber: 'RE-2024-10203' },
    { id: 'ct4', name: 'Sarah Miller', email: 'sarah.m@email.com', avatarSeed: 'sarah', accountNumber: 'RE-2024-10204' },
    { id: 'ct5', name: 'David Chen', email: 'david.c@email.com', avatarSeed: 'david', accountNumber: 'RE-2024-10205' },
    { id: 'ct6', name: 'Amina Toure', email: 'amina.t@email.com', avatarSeed: 'amina', accountNumber: 'RE-2024-10206' },
  ],

  billers: [
    { id: 'bl1', name: 'Netflix', icon: 'netflix', category: 'streaming', amount: 15.99, lastPaid: new Date(now - 30 * day).toISOString() },
    { id: 'bl2', name: 'Electric Co.', icon: 'lightning-bolt', category: 'electricity', amount: 84.20, lastPaid: new Date(now - 15 * day).toISOString() },
    { id: 'bl3', name: 'Fiber Internet', icon: 'wifi', category: 'internet', amount: 55.00, lastPaid: new Date(now - 28 * day).toISOString() },
    { id: 'bl4', name: 'Water Utility', icon: 'water', category: 'water', amount: 32.50, lastPaid: new Date(now - 20 * day).toISOString() },
    { id: 'bl5', name: 'Car Insurance', icon: 'car', category: 'insurance', amount: 120.00, lastPaid: new Date(now - 60 * day).toISOString() },
  ],

  transactions: [
    { id: 'tx01', title: 'Amazon', date: new Date(now).toISOString(), amount: -156.00, icon: 'shopping-outline', category: 'shopping', status: 'completed' },
    { id: 'tx02', title: 'Starbucks', date: new Date(now - 1 * day).toISOString(), amount: -8.50, icon: 'coffee', category: 'food', status: 'completed' },
    { id: 'tx03', title: 'Salary Deposit', date: new Date(now - 2 * day).toISOString(), amount: 5200.00, icon: 'cash-plus', category: 'salary', sender: 'INPT Corp.', status: 'completed' },
    { id: 'tx04', title: 'Netflix', date: new Date(now - 3 * day).toISOString(), amount: -15.99, icon: 'play-circle', category: 'bill', status: 'completed' },
    { id: 'tx05', title: 'Uber Ride', date: new Date(now - 3 * day).toISOString(), amount: -22.40, icon: 'car', category: 'transport', status: 'completed' },
    { id: 'tx06', title: 'Transfer to Elena', date: new Date(now - 4 * day).toISOString(), amount: -350.00, icon: 'account-arrow-right', category: 'transfer', recipient: 'Elena Garcia', status: 'completed' },
    { id: 'tx07', title: 'Electric Co.', date: new Date(now - 5 * day).toISOString(), amount: -84.20, icon: 'lightning-bolt', category: 'bill', status: 'completed' },
    { id: 'tx08', title: 'Grocery Mart', date: new Date(now - 5 * day).toISOString(), amount: -67.30, icon: 'cart', category: 'shopping', status: 'completed' },
    { id: 'tx09', title: 'Freelance Payment', date: new Date(now - 7 * day).toISOString(), amount: 1200.00, icon: 'cash-plus', category: 'salary', sender: 'DesignHub', status: 'completed' },
    { id: 'tx10', title: 'Fiber Internet', date: new Date(now - 10 * day).toISOString(), amount: -55.00, icon: 'wifi', category: 'bill', status: 'completed' },
    { id: 'tx11', title: 'International: Madrid', date: new Date(now - 12 * day).toISOString(), amount: -420.00, icon: 'earth', category: 'international', recipient: 'Carlos Ruiz', status: 'completed' },
    { id: 'tx12', title: 'Water Utility', date: new Date(now - 14 * day).toISOString(), amount: -32.50, icon: 'water', category: 'bill', status: 'completed' },
    { id: 'tx13', title: 'McDonald\'s', date: new Date(now - 15 * day).toISOString(), amount: -12.80, icon: 'food', category: 'food', status: 'completed' },
    { id: 'tx14', title: 'Savings Transfer', date: new Date(now - 18 * day).toISOString(), amount: -500.00, icon: 'bank-transfer', category: 'transfer', recipient: 'Savings Account', status: 'completed' },
    { id: 'tx15', title: 'Car Insurance', date: new Date(now - 25 * day).toISOString(), amount: -120.00, icon: 'car', category: 'bill', status: 'completed' },
  ],
};

// ── DB Access ──────────────────────────────────────────

export async function getDb(): Promise<MockData> {
  try {
    const data = await AsyncStorage.getItem(DB_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('DB Get Error', e);
  }
  await saveDb(defaultData);
  return { ...defaultData };
}

export async function saveDb(data: MockData): Promise<void> {
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('DB Save Error', e);
  }
}

/** Helper: wipe DB and start fresh (useful for dev) */
export async function resetDb(): Promise<MockData> {
  await saveDb(defaultData);
  return { ...defaultData };
}
