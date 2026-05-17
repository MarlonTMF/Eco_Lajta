// application/mappers/reward.mapper.ts
import { RewardEntity, TransactionEntity, UserWalletEntity, RewardCategory, TransactionType } from '../../domain/entities/reward.entity';
import { RewardDto, TransactionDto, WalletDto } from '../dtos/reward.dto';

export function mapDtoToReward(dto: RewardDto): RewardEntity {
  return new RewardEntity(
    dto.id,
    dto.name,
    dto.description,
    dto.pointCost,
    dto.imageUrl,
    dto.iconName ?? 'redeem',
    (dto.category as RewardCategory) ?? 'Otro',
    dto.provider ?? '',
    dto.available ?? true,
  );
}

export function mapDtoToTransaction(dto: TransactionDto): TransactionEntity {
  const type: TransactionType = dto.points >= 0 ? 'earn' : 'redeem';
  const date = new Date(dto.createdAt).toLocaleDateString('es-BO', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return new TransactionEntity(
    dto.id,
    dto.description,
    dto.location ?? '',
    dto.category ?? '',
    date,
    Math.abs(dto.points),
    type,
    dto.icon ?? (type === 'earn' ? 'recycling' : 'shopping_cart'),
  );
}

export function mapDtoToWallet(dto: WalletDto): UserWalletEntity {
  return new UserWalletEntity(
    dto.userId,
    dto.totalPoints,
    dto.ecoLevel ?? 1,
    dto.nextLevelPoints ?? 3000,
    (dto.transactions ?? []).map(mapDtoToTransaction),
  );
}
