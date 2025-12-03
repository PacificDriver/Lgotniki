import { Card, CardType } from '../types';
export declare class CardModel {
    static create(data: Omit<Card, 'id' | 'linkedAt' | 'unlinkedAt'>): Promise<Card>;
    static findById(id: string): Promise<Card | null>;
    static findByIdentifier(cardType: CardType, cardIdentifier: string): Promise<Card | null>;
    static findByBeneficiary(beneficiaryId: string, activeOnly?: boolean): Promise<Card[]>;
    static unlink(id: string): Promise<boolean>;
    private static mapRowToCard;
}
//# sourceMappingURL=Card.d.ts.map