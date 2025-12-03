import { BenefitAssignment } from '../types';
export declare class BenefitAssignmentModel {
    static create(data: Omit<BenefitAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<BenefitAssignment>;
    static findById(id: string): Promise<BenefitAssignment | null>;
    static findByBeneficiary(beneficiaryId: string, activeOnly?: boolean): Promise<BenefitAssignment[]>;
    static update(id: string, data: Partial<BenefitAssignment>): Promise<BenefitAssignment | null>;
    private static mapRowToAssignment;
}
//# sourceMappingURL=BenefitAssignment.d.ts.map