// presentation/screens/admin/mission-detail/mission-detail.component.ts
import { Component, inject, input, resource, computed } from '@angular/core';
import { RouterLink }                from '@angular/router';
import { GetMissionDetailUseCase }   from '../../../../application/use-cases/get-mission-detail.use-case';
import { DirtyPointsPipe }           from '../../../shared/pipes/dirty-points-format.pipe';
import { ProgressBarComponent }      from '../../../shared/components/progress-bar/progress-bar.component';
import { MissionDto }               from '../../../../application/dtos/mission.dto';

@Component({
  standalone: true,
  selector: 'app-admin-mission-detail',
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.scss'],
  imports: [RouterLink, DirtyPointsPipe, ProgressBarComponent],
})
export class AdminMissionDetailComponent {
  // Route param auto-bound via withComponentInputBinding() — no ActivatedRoute needed
  readonly id = input.required<string>();

  private getDetail = inject(GetMissionDetailUseCase);

  readonly missionResource = resource({
    loader: () => this.getDetail.execute(this.id()),
  });

  readonly vm = computed(() => {
    const m = this.missionResource.value() as MissionDto;
    if (!m) return null;
    return {
      ...m,
      slotBarColor: m.slotFillPercent > 75 ? '#2E7D32' : m.slotFillPercent > 40 ? '#F59E0B' : '#EF4444',
    };
  });
}
