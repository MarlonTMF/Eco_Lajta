export interface RewardDTO {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;           // en Dirty Points
  imagenUrl: string;
  categoria: string;
  stock: number | null;    // null = ilimitado
}

export interface BalanceDTO {
  dirtyPoints: number;
  ultimaActualizacion: string; // ISO 8601
}

export interface RedeemResultDTO {
  exitoso: boolean;
  nuevoSaldo: number;
  codigoTicket: string;
  nombrePremio: string;
}
