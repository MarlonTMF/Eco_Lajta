// presentation/screens/admin/missions/missions.component.ts
import { Component, inject, signal, linkedSignal, computed, resource } from '@angular/core';
import { Router } from '@angular/router';
import { GetMissionsUseCase } from '../../../../application/use-cases/get-missions.use-case';
import { CreateMissionUseCase } from '../../../../application/use-cases/create-mission.use-case';
import { DirtyPointsPipe } from '../../../shared/pipes/dirty-points-format.pipe';
import { ProgressBarComponent } from '../../../shared/components/progress-bar/progress-bar.component';
import { MissionDto, CreateMissionFormDto } from '../../../../application/dtos/mission.dto';

@Component({
  standalone: true,
  selector: 'app-admin-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
  imports: [DirtyPointsPipe],
})
export class AdminMissionsComponent {
  private getMissions    = inject(GetMissionsUseCase);
  private createMission  = inject(CreateMissionUseCase);
  private router         = inject(Router);

  readonly missionsResource = resource({
    loader: () => this.getMissions.execute(),
  });

  readonly searchTerm = signal<string>('');

  readonly filteredMissions = linkedSignal<MissionDto[]>(() =>
    (this.missionsResource.value()?.missions ?? []).filter(m =>
      m.title.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  // Modal state
  readonly showModal    = signal<boolean>(false);
  readonly submitting   = signal<boolean>(false);

  // Form fields as signals
  readonly formTitle       = signal<string>('');
  readonly formDescription = signal<string>('');
  readonly formPool        = signal<number>(0);
  readonly formSlots       = signal<number>(0);
  readonly formDistrict    = signal<string>('');

  openModal():  void { this.showModal.set(true);  }
  closeModal(): void { this.showModal.set(false); }

  navigateToDetail(id: string): void {
    this.router.navigate(['/admin/missions', id]);
  }

  async launchMission(): Promise<void> {
    this.submitting.set(true);
    const form: CreateMissionFormDto = {
      title:                 this.formTitle(),
      description:           this.formDescription(),
      rewardPoolDirtyPoints: this.formPool(),
      slotsTotal:            this.formSlots(),
      district:              this.formDistrict(),
    };
    await this.createMission.execute(form);
    this.missionsResource.reload();
    this.closeModal();
    this.submitting.set(false);
  }
}
