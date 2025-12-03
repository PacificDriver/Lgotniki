import { BenefitType } from '../types';
export declare class BenefitTypeModel {
    static create(data: Omit<BenefitType, 'id' | 'createdAt' | 'updatedAt'>): Promise<BenefitType>;
    static findById(id: string): Promise<BenefitType | null>;
    static findAll(activeOnly?: boolean): Promise<BenefitType[]>;
    static update(id: string, data: Partial<BenefitType>): Promise<BenefitType | null>;
    static delete(id: string): Promise<boolean>;
    static hasRelatedData(id: string): Promise<{
        hasData: boolean;
        details: string[];
    }>;
    private static mapRowToBenefitType;
}
//# sourceMappingURL=BenefitType.d.ts.map