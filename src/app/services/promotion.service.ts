import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Promise<Promotion[]> {
    return new Promise(resolve => {
      // simlate server latency of 2 seconds
      setTimeout(() => resolve(PROMOTIONS), 3000);
    });
  }

  getPromotion(id: string): Promise<Promotion> {
    return new Promise(resolve => {
      // simlate server latency of 2 seconds
      setTimeout(() => resolve(PROMOTIONS.filter((promotion) => (promotion.id === id))[0]), 3000);
    });
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return new Promise(resolve => {
      // simlate server latency of 2 seconds
      setTimeout(() => resolve(PROMOTIONS.filter((promotion) => promotion.featured)[0]), 3000);
    });
  }
}
