import pool from '../config/database';
import { Card, CardType } from '../types';

export class CardModel {
  static async create(data: Omit<Card, 'id' | 'linkedAt' | 'unlinkedAt'>): Promise<Card> {
    // Deactivate existing cards with same identifier
    await pool.query(
      `UPDATE cards SET is_active = false, unlinked_at = CURRENT_TIMESTAMP 
       WHERE card_identifier = $1 AND card_type = $2 AND is_active = true`,
      [data.cardIdentifier, data.cardType]
    );

    const result = await pool.query(
      `INSERT INTO cards (beneficiary_id, card_type, card_identifier, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [data.beneficiaryId, data.cardType, data.cardIdentifier, data.isActive !== undefined ? data.isActive : true]
    );
    return this.mapRowToCard(result.rows[0]);
  }

  static async findById(id: string): Promise<Card | null> {
    const result = await pool.query('SELECT * FROM cards WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToCard(result.rows[0]);
  }

  static async findByIdentifier(cardType: CardType, cardIdentifier: string): Promise<Card | null> {
    const result = await pool.query(
      'SELECT * FROM cards WHERE card_type = $1 AND card_identifier = $2 AND is_active = true',
      [cardType, cardIdentifier]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToCard(result.rows[0]);
  }

  static async findByBeneficiary(beneficiaryId: string, activeOnly: boolean = true): Promise<Card[]> {
    let query = 'SELECT * FROM cards WHERE beneficiary_id = $1';
    if (activeOnly) {
      query += ' AND is_active = true';
    }
    query += ' ORDER BY linked_at DESC';
    const result = await pool.query(query, [beneficiaryId]);
    return result.rows.map(this.mapRowToCard);
  }

  static async unlink(id: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE cards SET is_active = false, unlinked_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static mapRowToCard(row: any): Card {
    return {
      id: row.id,
      beneficiaryId: row.beneficiary_id,
      cardType: row.card_type,
      cardIdentifier: row.card_identifier,
      isActive: row.is_active,
      linkedAt: row.linked_at,
      unlinkedAt: row.unlinked_at,
    };
  }
}


