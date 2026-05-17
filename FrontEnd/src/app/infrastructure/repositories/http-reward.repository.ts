import { environment } from '../../../environments/environment';
// infrastructure/repositories/http-reward.repository.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { IRewardRepository } from '../../domain/repositories/reward.repository';
import { RewardEntity, TransactionEntity, UserWalletEntity } from '../../domain/entities/reward.entity';
import { RewardDto, TransactionDto, WalletDto, RedeemResponseDto } from '../../application/dtos/reward.dto';
import { mapDtoToReward, mapDtoToTransaction, mapDtoToWallet } from '../../application/mappers/reward.mapper';

const BASE_URL = environment.apiUrl;

// ─────────────────────────────────────────────────────────────────
// MOCK DATA — used as fallback when backend is not yet available
// ─────────────────────────────────────────────────────────────────
const MOCK_REWARDS: RewardDto[] = [
  {
    id: 'reward-1',
    name: 'Canasta de Alimentos (EMAPA)',
    description: 'Productos básicos de alta calidad producidos por agricultores locales certificados.',
    pointCost: 450,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkRHwETf8GPQYFDQ-EFEcfTycNIWJaFd4WtHJSM2iTktl43VaTsPi0iqHsLFZAZww1KUys-nOiF8iWTYEwKTFSzLPWl4y4PNWR4bbV6uxTItQntkWXpKYIkujcL4ENXq1NRHHbpH5Ov0VKo8vpLDT3p9jeO5qVVcSWfr4p718SCM1zClJC-gkZWCoJwjc1cyi4rrDJz4cho-6-ooneInem-BOGy_7DxELLDi26T56qYWv_Lpw-njAmE7i5jb5nL07z9EG_bUmXHAJ',
    iconName: 'shopping_basket',
    category: 'Alimentos',
    provider: 'EMAPA',
    available: true,
  },
  {
    id: 'reward-2',
    name: 'Descuento Predial (Municipio)',
    description: 'Obtén un 15% de descuento en tus impuestos prediales anuales por tu compromiso ambiental.',
    pointCost: 800,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD23z8T_-kN-0e-RWhgwxLYtOqthq7A-5s-XANI62F1LuNOSFhnFcgBYumwSjAhcNeHCaw1z--NUnkx5c9Q428UnW1BQU0DImQ9bz-QNxj303-IGtP26Criiel_xbdlvgrFg3pFecUnGZ7LuB0qBmk9cS4l1eUCj9gDsv1rmOroWq9cZHRdCAEteg0kwNDVHIC1kK0qG3UGhK-KMUcCqmtvlfm7tGnNObL91vJxC0-TRw7vnhNlyXpE0hcQY5iXFcg6jQN5r-dbMlDi',
    iconName: 'receipt_long',
    category: 'Impuestos',
    provider: 'Municipio de Cochabamba',
    available: true,
  },
  {
    id: 'reward-3',
    name: 'Score Crediticio (Banco Verde)',
    description: 'Mejora tu calificación crediticia para préstamos de vivienda sostenible.',
    pointCost: 1200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLVNMufydUnRCOCLhs6U5zvFSFG8S-WMCfGE_hKuaAGdenie5Z0j_lUxCiDXwY5Y6qTzuBkUhw3y0-Q5PRQ1_YU1ay3MJNs2M5CuVNJsTcT0yHNlB2LvSBK63tnNrqycT60eu2Y4zrotJqI6RtZtu7jqiLev-9h6G6Jf4ARnt6mw-mnspF-iGGL85S5ojnSEMCECi-hAwd_qd4FTiDL1tcj4WE4v4dL88zg5JieaLflKLtL-tOkYirZmoVSDB8xr_9psOBJfz_QzwQ',
    iconName: 'trending_up',
    category: 'Finanzas',
    provider: 'Banco Verde',
    available: true,
  },
];

const MOCK_WALLET: WalletDto = {
  userId: 'mateo-velasco',
  totalPoints: 2450,
  ecoLevel: 3,
  nextLevelPoints: 3000,
  transactions: [
    { id: 'tx-1', description: 'PET recycling', location: 'Centro de Acopio Sur', category: 'Reciclaje', createdAt: '2026-10-24T10:00:00Z', points: 45, icon: 'recycling' },
    { id: 'tx-2', description: 'EMAPA redemption', location: 'Canje de beneficios', category: 'Recompensa', createdAt: '2026-10-22T09:00:00Z', points: -200, icon: 'shopping_cart' },
    { id: 'tx-3', description: 'Compost delivery', location: 'Residuos orgánicos', category: 'Reciclaje', createdAt: '2026-10-20T11:00:00Z', points: 120, icon: 'compost' },
    { id: 'tx-4', description: 'Misión Río Rocha', location: 'Puente Cobija', category: 'Misión', createdAt: '2026-10-15T08:00:00Z', points: 500, icon: 'groups' },
    { id: 'tx-5', description: 'Vidrio reciclado', location: 'Punto Verde Cala Cala', category: 'Reciclaje', createdAt: '2026-10-12T14:00:00Z', points: 85, icon: 'wine_bar' },
  ],
};

@Injectable()
export class HttpRewardRepository implements IRewardRepository {
  constructor(private http: HttpClient) {}

  getRewards(): Observable<RewardEntity[]> {
    return this.http.get<{success: boolean, value: any[]}>(`${BASE_URL}/rewards`).pipe(
      map(res => {
        if (!res.success || !res.value) return [];
        return res.value.map(item => this.mapBackendToEntity(item));
      }),
      catchError(() => {
        console.warn('[RewardRepository] Backend not reachable — using mock data');
        return of(MOCK_REWARDS.map(mapDtoToReward));
      })
    );
  }

  createReward(data: any): Observable<RewardEntity> {
    return this.http.post<{success: boolean, value: any}>(`${BASE_URL}/rewards`, data).pipe(
      map(res => {
        if (!res.success || !res.value) throw new Error('Failed to create reward');
        return this.mapBackendToEntity(res.value);
      })
    );
  }

  updateReward(id: string, data: any): Observable<RewardEntity> {
    return this.http.put<{success: boolean, value: any}>(`${BASE_URL}/rewards/${id}`, data).pipe(
      map(res => {
        if (!res.success || !res.value) throw new Error('Failed to update reward');
        return this.mapBackendToEntity(res.value);
      })
    );
  }

  deleteReward(id: string): Observable<void> {
    return this.http.delete<{success: boolean, value: any}>(`${BASE_URL}/rewards/${id}`).pipe(
      map(res => {
        if (!res.success) throw new Error('Failed to delete reward');
      })
    );
  }

  private mapBackendToEntity(item: any): RewardEntity {
    return new RewardEntity(
      item.id ? item.id.toString() : ('reward-' + Date.now()),
      item.name || 'Untitled',
      item.description || '',
      item.pointsCost || 0,
      item.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
      item.icon || 'eco',
      item.category || 'Otro',
      item.provider || '',
      item.stock ? item.stock > 0 : true
    );
  }

  getWallet(): Observable<UserWalletEntity> {
    return this.http.get<WalletDto>(`${BASE_URL}/rewards/wallet`).pipe(
      map(mapDtoToWallet),
      catchError(() => {
        console.warn('[RewardRepository] Backend not reachable — using mock wallet');
        return of(mapDtoToWallet(MOCK_WALLET));
      })
    );
  }

  redeemReward(rewardId: string): Observable<{ redemptionId: string; newBalance: number }> {
    return this.http.post<RedeemResponseDto>(`${BASE_URL}/rewards/redeem`, { rewardId }).pipe(
      catchError(() => {
        console.warn('[RewardRepository] Redeem endpoint not reachable — simulating');
        return of({ redemptionId: `MOCK-${Date.now()}`, newBalance: 0 });
      })
    );
  }

  getTransactions(): Observable<TransactionEntity[]> {
    return this.http.get<TransactionDto[]>(`${BASE_URL}/rewards/transactions`).pipe(
      map(dtos => dtos.map(mapDtoToTransaction)),
      catchError(() => {
        console.warn('[RewardRepository] Transactions endpoint not reachable — using mock');
        return of(MOCK_WALLET.transactions.map(mapDtoToTransaction));
      })
    );
  }
}
