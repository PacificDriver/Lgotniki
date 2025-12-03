import { Beneficiary, BeneficiaryStatus } from '../types';
import { OperationType } from '../types';
export declare class BeneficiaryModel {
    static create(data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Beneficiary>;
    static findById(id: string): Promise<Beneficiary | null>;
    static findByPhone(phone: string): Promise<Beneficiary | null>;
    static findByCard(cardType: string, cardIdentifier: string): Promise<Beneficiary | null>;
    static findAll(filters?: {
        status?: BeneficiaryStatus;
        benefitTypeId?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        beneficiaries: Beneficiary[];
        total: number;
    }>;
    static update(id: string, data: Partial<Beneficiary>): Promise<Beneficiary | null>;
    static delete(id: string): Promise<boolean>;
    static logOperation(beneficiaryId: string, operationType: OperationType, performedBy: string, performedByName: string, details?: Record<string, any>): Promise<void>;
    static getOperations(beneficiaryId: string): Promise<any[]>;
    private static mapRowToBeneficiary;
}
//# sourceMappingURL=Beneficiary.d.ts.map