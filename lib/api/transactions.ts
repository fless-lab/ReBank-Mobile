import { Transaction as BackendTransaction } from '../types/api';
import { api } from './client';

export interface RecentContact {
  numero: number;
  first_name: string;
  last_name: string;
}

export const TransactionsService = {
  /** List all transactions for the authenticated user */
  async list(): Promise<BackendTransaction[]> {
    return api.get<BackendTransaction[]>('/api/transactions/list');
  },

  /** Get a single transaction by ID */
  async detail(id: number): Promise<BackendTransaction> {
    return api.get<BackendTransaction>(`/api/transactions/${id}`);
  },

  /** Deposit money into an account */
  async deposit(accountId: number, amount: number): Promise<void> {
    await api.post('/api/transactions/deposit', {
      account_id: accountId,
      amount,
    });
  },

  /** Withdraw money from an account */
  async withdraw(accountId: number, amount: number): Promise<void> {
    await api.post('/api/transactions/withdraw', {
      account_id: accountId,
      amount,
    });
  },

  /** Transfer money between accounts */
  async transfer(
    sourceAccountId: number,
    destinationAccountNumero: string,
    amount: number,
  ): Promise<void> {
    await api.post('/api/transactions/transfer', {
      source_account_id: sourceAccountId,
      destination_account_numero: destinationAccountNumero,
      amount,
    });
  },

  /** Get recent transfer recipients (deduplicated, max 10) */
  async recentContacts(): Promise<RecentContact[]> {
    return api.get<RecentContact[]>('/api/contacts/recent');
  },
};
