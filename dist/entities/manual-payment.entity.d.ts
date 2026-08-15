export declare enum ManualPaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CONFIRMED = "CONFIRMED"
}
export declare class ManualPayment {
    id: number;
    requesterId: number;
    budgetCode: string;
    description: string;
    amount: number;
    status: ManualPaymentStatus;
    paymentType: string;
    confirmationToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
