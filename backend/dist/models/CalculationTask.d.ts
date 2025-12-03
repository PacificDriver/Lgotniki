import { CalculationTask, TaskStatus } from '../types';
export declare class CalculationTaskModel {
    static create(data: Omit<CalculationTask, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Promise<CalculationTask>;
    static findById(id: string): Promise<CalculationTask | null>;
    static findAll(filters?: {
        status?: TaskStatus;
        benefitTypeId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        tasks: CalculationTask[];
        total: number;
    }>;
    static update(id: string, data: Partial<CalculationTask>): Promise<CalculationTask | null>;
    private static mapRowToTask;
}
//# sourceMappingURL=CalculationTask.d.ts.map