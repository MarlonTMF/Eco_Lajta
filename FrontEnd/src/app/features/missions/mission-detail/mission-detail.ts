import { Component, OnInit, signal, inject, NgZone } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MissionService, Mission } from '../../../shared/services/mission.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [RouterModule, CommonModule, GoogleMapsModule],
  templateUrl: './mission-detail.html',
  styleUrl: './mission-detail.css',
})
export class MissionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private missionService = inject(MissionService);
  private ngZone = inject(NgZone);

  mission = signal<Mission | null>(null);
  apiLoaded = signal(false);

  readonly mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
    clickableIcons: false,
  };

  ngOnInit(): void {
    this.loadGoogleMaps();
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.loadMission(parseInt(idStr, 10));
      } else {
        this.missionService.getAll().subscribe({
          next: list => { if (list.length > 0) this.mission.set(list[0]); }
        });
      }
    });
  }

  private loadGoogleMaps(): void {
    if (typeof (window as any).google?.maps !== 'undefined') {
      this.ngZone.run(() => this.apiLoaded.set(true));
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      (window as any).googleMapsCallback = () =>
        this.ngZone.run(() => this.apiLoaded.set(true));
      return;
    }
    (window as any).googleMapsCallback = () =>
      this.ngZone.run(() => this.apiLoaded.set(true));

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=marker&loading=async&callback=googleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  loadMission(id: number): void {
    this.missionService.getOne(id).subscribe({
      next: data => this.mission.set(data),
      error: err => console.error('Error loading mission detail:', err)
    });
  }

  /** Devuelve LatLngLiteral solo si la misión tiene coordenadas válidas */
  missionCenter(m: Mission): google.maps.LatLngLiteral | null {
    return m.latitude && m.longitude
      ? { lat: m.latitude, lng: m.longitude }
      : null;
  }

  /** Contenido HTML del pin único */
  buildPin(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'gm-pin recycling is-selected';
    el.innerHTML = `
      <div class="gm-pin-body" style="
        position:relative; width:44px; height:44px;
        border-radius:50% 50% 50% 0; transform:rotate(-45deg);
        display:flex; align-items:center; justify-content:center;
        background:#0d631b;">
        <span class="material-symbols-outlined gm-pin-icon" style="
          transform:rotate(45deg); font-size:22px; color:white;
          font-family:'Material Symbols Outlined' !important;
          font-variation-settings:'FILL' 1;">recycling</span>
      </div>
    `;
    return el;
  }

  getMissionImage(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('reforest') || t.includes('árbol') || t.includes('arbol'))
      return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
    if (t.includes('vidrio') || t.includes('botella') || t.includes('recicla'))
      return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80';
    if (t.includes('compost') || t.includes('orgán'))
      return 'https://images.unsplash.com/photo-1622353381669-e339bf4b3e8e?w=800&q=80';
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80';
  }

  formatMissionDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    } catch { return 'Eco Date'; }
  }

  formatMissionTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      let h = date.getHours();
      const m = date.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    } catch { return '08:30 AM'; }
  }
}