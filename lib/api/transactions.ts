import { Transaction as BackendTransaction } from '../types/api';
import { api } from './client';

export const TransactionsService = {
  /** List all transactions for the authenticated user */
  async list(): Promise<BackendTransaction[]> {
    return api.get<BackendTransaction[]>('/api/transactions/list');
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
};
