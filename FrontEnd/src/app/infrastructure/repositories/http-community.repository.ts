import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LeaderboardEntryDTO, NewsFeedItemDTO } from '../../application/dtos/community.dto';

@Injectable({ providedIn: 'root' })
export class HttpCommunityRepository {
  private readonly base = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getLeaderboard(): Promise<LeaderboardEntryDTO[]> {
    return firstValueFrom(
      this.http.get<LeaderboardEntryDTO[]>(`${this.base}/community/leaderboard`)
    );
  }

  getNewsFeed(): Promise<NewsFeedItemDTO[]> {
    return firstValueFrom(
      this.http.get<NewsFeedItemDTO[]>(`${this.base}/community/feed`)
    );
  }
}
