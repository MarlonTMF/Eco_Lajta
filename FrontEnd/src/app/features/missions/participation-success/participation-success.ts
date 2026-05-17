import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MissionService, Mission } from '../../../shared/services/mission.service';

@Component({
  selector: 'app-participation-success',
  imports: [RouterModule, CommonModule],
  templateUrl: './participation-success.html',
  styleUrl: './participation-success.css',
})
export class ParticipationSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private missionService = inject(MissionService);

  mission = signal<Mission | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idStr = params['id'];
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadMission(id);
      } else {
        // Fallback: load all and pick the first one
        this.missionService.getAll().subscribe({
          next: (list) => {
            if (list.length > 0) {
              this.mission.set(list[0]);
            }
          }
        });
      }
    });
  }

  loadMission(id: number): void {
    this.missionService.getOne(id).subscribe({
      next: (data) => {
        this.mission.set(data);
      },
      error: (err) => {
        console.error('Error loading success mission detail:', err);
      }
    });
  }

  formatMissionDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const month = monthNames[date.getMonth()];
      return `${day} ${month}`;
    } catch (e) {
      return 'Eco Date';
    }
  }

  formatMissionTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // hour 0 should be 12
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return '08:30 AM';
    }
  }
}
