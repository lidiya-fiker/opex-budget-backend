import { Injectable } from '@nestjs/common';

@Injectable()
export class MockGlService {
  /**
   * Generates a deterministic mock actual amount based on branchId, categoryId, and currency
   */
  async getActuals(branchId: number, categoryId: number, currency: string): Promise<number> {
    // Deterministic random generation for testing consistency
    const seed = branchId * 1000 + categoryId;
    const baseAmount = (seed % 100) * 5000;
    
    // Slight variation based on currency
    const currencyModifier = currency === 'ETB' ? 1 : 
                             currency === 'USD' ? 120 : 
                             currency === 'EUR' ? 130 : 1;
                             
    return baseAmount / currencyModifier;
  }
}
