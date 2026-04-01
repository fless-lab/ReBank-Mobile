// ── Backend API response types ──────────────────────────

export interface BankAccount {
  id: number;
  first_name: string;
  last_name: string;
  identity_file: string;
  approved: boolean;
  approved_at: string | null;
  numero: number | null;
  balance: number;
  user: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface TransactionAccount {
  numero: number;
  first_name: string;
  last_name: string;
}

export interface Transaction {
  id: number;
  source_account: TransactionAccount | null;
  destination_account: TransactionAccount | null;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  balance_after: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface LoginResponse {
  id_token: string;
  otp_exp: number;
}

export interface LoginOtpResponse {
  access_token: string;
  refresh_token: string;
}

export interface AccountDetailResponse {
  account: BankAccount;
  transaction: Transaction[];
}

export interface MessageResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
  id_token?: string;
  otp_exp?: number;
}

export interface ResetPasswordResponse {
  id_token: string;
  otp_exp: number;
  message: string;
}

export interface ResetPasswordOtpResponse {
  reset_token: string;
  reset_exp: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
