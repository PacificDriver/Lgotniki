export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserModel {
    static create(data: {
        username: string;
        email: string;
        password: string;
        fullName: string;
        role?: string;
        isActive?: boolean;
    }): Promise<Omit<User, 'passwordHash'>>;
    static findById(id: string): Promise<Omit<User, 'passwordHash'> | null>;
    static findByUsername(username: string): Promise<User | null>;
    static verifyPassword(user: User, password: string): Promise<boolean>;
    static listOperators(): Promise<Array<Omit<User, 'passwordHash'>>>;
    static updateById(id: string, data: {
        username?: string;
        email?: string;
        fullName?: string;
        password?: string;
        role?: string;
        isActive?: boolean;
    }): Promise<Omit<User, 'passwordHash'> | null>;
    static deleteById(id: string): Promise<void>;
    private static mapRowToUser;
}
//# sourceMappingURL=User.d.ts.map