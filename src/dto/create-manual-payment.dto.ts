export class CreateManualPaymentDto {
  requesterId: number;
  budgetCode: string;
  description: string;
  amount: number;
  paymentType?: string;
}
