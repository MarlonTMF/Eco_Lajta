export interface RewardDTO {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  icon: string;
  category: string;
  location?: string;
}

export interface BalanceDTO {
  balance: number;
}

export interface RedeemResultDTO {
  success: boolean;
  ticketId: string;
  message?: string;
}
