import { LoadMode } from '../types';
interface UploadResult {
    total: number;
    created: number;
    updated: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
}
export declare class FileUploadService {
    static parseFile(filePath: string, fileType: string): Promise<any[]>;
    static processUpload(records: any[], loadMode: LoadMode, userId: string, userName: string): Promise<UploadResult>;
}
export {};
//# sourceMappingURL=fileUploadService.d.ts.map