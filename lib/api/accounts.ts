import { AccountDetailResponse, BankAccount, MessageResponse } from '../types/api';
import { api } from './client';

export const AccountsService = {
  /** List all bank accounts for the authenticated user */
  async list(): Promise<BankAccount[]> {
    return api.get<BankAccount[]>('/api/accounts/list');
  },

  /** Get account detail with last 5 transactions */
  async detail(accountId: number): Promise<AccountDetailResponse> {
    return api.get<AccountDetailResponse>(`/api/accounts/${accountId}/`);
  },

  /** Create a new bank account (pending staff approval) */
  async create(firstName: string, lastName: string, identityFileUri: string): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('identity_file', {
      uri: identityFileUri,
      type: 'image/jpeg',
      name: 'identity.jpg',
    } as any);
    return api.upload<MessageResponse>('/api/accounts/', formData);
  },

  /** Update a bank account (only if not yet approved) */
  async update(
    accountId: number,
    firstName: string,
    lastName: string,
    identityFileUri: string,
  ): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('identity_file', {
      uri: identityFileUri,
      type: 'image/jpeg',
      name: 'identity.jpg',
    } as any);
    return api.uploadPut<MessageResponse>(`/api/accounts/${accountId}/update/`, formData);
  },
};
