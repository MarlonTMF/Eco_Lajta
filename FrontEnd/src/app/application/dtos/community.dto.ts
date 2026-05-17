export interface LeaderboardEntryDTO {
  posicion: number;
  userId: string;
  nombreUsuario: string;
  avatarUrl: string;
  dirtyPoints: number;
  nivelInsignia: string;
}

export interface NewsFeedItemDTO {
  id: string;
  tipo: 'logro' | 'canje' | 'desafio';
  mensaje: string;
  fechaHora: string; // ISO 8601
  usuarioActor: string;
  avatarActor: string;
}
