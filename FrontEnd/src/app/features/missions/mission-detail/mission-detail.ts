import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MissionService, Mission } from '../../../shared/services/mission.service';

@Component({
  selector: 'app-mission-detail',
  imports: [RouterModule, CommonModule],
  templateUrl: './mission-detail.html',
  styleUrl: './mission-detail.css',
})
export class MissionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private missionService = inject(MissionService);

  mission = signal<Mission | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
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
        console.error('Error loading mission detail:', err);
      }
    });
  }

  getMissionImage(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('reforest') || t.includes('árbol') || t.includes('arbol')) {
      return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
    }
    if (t.includes('vidrio') || t.includes('botella') || t.includes('recicla')) {
      return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80';
    }
    if (t.includes('compost') || t.includes('orgán')) {
      return 'https://images.unsplash.com/photo-1622353381669-e339bf4b3e8e?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80';
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
