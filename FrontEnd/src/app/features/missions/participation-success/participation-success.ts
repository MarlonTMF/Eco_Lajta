import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  private sanitizer = inject(DomSanitizer);

  mission = signal<Mission | null>(null);
  qrImageUrl = signal<SafeUrl | null>(null);
  qrError = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idStr = params['id'];
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadMission(id);
      } else {
        this.missionService.getAll().subscribe({
          next: (list) => {
            if (list.length > 0) {
              this.mission.set(list[0]);
              this.loadQrCode(list[0].id);
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
        this.loadQrCode(id);
      },
      error: (err) => {
        console.error('Error loading success mission detail:', err);
      }
    });
  }

  loadQrCode(eventId: number): void {
    console.log('[QR] Requesting QR for eventId:', eventId);
    this.qrError.set(null);
    this.missionService.getAttendanceQr(eventId).subscribe({
      next: (blob) => {
        console.log('[QR] Blob received. Type:', blob.type, '| Size:', blob.size);
        if (!blob || blob.size === 0) {
          this.qrError.set('El servidor devolvió un QR vacío.');
          return;
        }
        const objectUrl = URL.createObjectURL(blob);
        console.log('[QR] Object URL created:', objectUrl);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.qrImageUrl.set(safeUrl);
        console.log('[QR] qrImageUrl signal set.');
      },
      error: (err) => {
        console.error('[QR] HTTP Error:', err.status, err.statusText, err);
        this.qrError.set(`Error ${err.status}: No se pudo generar el QR.`);
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
