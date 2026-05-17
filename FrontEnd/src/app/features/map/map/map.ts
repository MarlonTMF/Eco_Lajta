import { Component, OnInit, NgZone, signal, computed, effect, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule, GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { environment } from '../../../../environments/environment';
import { MAP_POINT_REPOSITORY_TOKEN } from '../../../infrastructure/tokens/injection-tokens';
import { MapPoint, MapPointType } from '../../../domain/entities/map-point.entity';

interface Category {
  id: 'all' | MapPointType;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit {
  @ViewChild(GoogleMap) googleMap?: GoogleMap;

  private repo = inject(MAP_POINT_REPOSITORY_TOKEN);
  private ngZone = inject(NgZone);

  /** Cochabamba center */
  readonly center = signal<google.maps.LatLngLiteral>({ lat: -17.3820, lng: -66.1560 });
  readonly zoom = signal(14);

  apiLoaded = signal(false);
  isLoading = signal(true);
  hasError = signal(false);
  isDrawerOpen = signal(false);
  selectedCategory = signal<'all' | MapPointType>('all');
  selectedPoint = signal<MapPoint | null>(null);
  mapPoints = signal<MapPoint[]>([]);

  readonly categories: Category[] = [
    { id: 'all',       label: 'Todos',                 icon: 'grid_view', color: '#10b981' },
    { id: 'recycling', label: 'Puntos de Reciclaje',   icon: 'recycling', color: '#0d631b' },
    { id: 'mission',   label: 'Misiones Ecológicas',   icon: 'groups',    color: '#00639a' },
    { id: 'reported',  label: 'Reportados',            icon: 'report',    color: '#ba1a1a' },
  ];

  readonly filteredPoints = computed(() => {
    const cat = this.selectedCategory();
    const points = this.mapPoints();
    return cat === 'all' ? points : points.filter(p => p.type === cat);
  });

  readonly mapOptions: google.maps.MapOptions = {
    mapId: 'ECOLLAJTA_MAP',
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'greedy',
    styles: [
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
    ]
  };

  constructor() {
    // Cuando cambia el punto seleccionado, centramos suavemente
    effect(() => {
      const p = this.selectedPoint();
      const map = this.googleMap?.googleMap;
      if (p && map) map.panTo({ lat: p.lat, lng: p.lng });
    });
  }

  ngOnInit(): void {
    this.loadGoogleMaps();
    this.loadPoints();
  }

  // ── Data ────────────────────────────────────────────────
  loadPoints(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.repo.getActivePoints().subscribe({
      next: points => {
        this.mapPoints.set(points);
        if (points.length > 0) this.selectedPoint.set(points[0]);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('[Map] error fetching points', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  // ── Google Maps loader ──────────────────────────────────
  private loadGoogleMaps(): void {
    if (typeof (window as any).google?.maps?.importLibrary !== 'undefined') {
      this.apiLoaded.set(true);
      return;
    }
    (window as any).googleMapsCallback = () => this.ngZone.run(() => this.apiLoaded.set(true));

    if (document.querySelector('script[src*="maps.googleapis.com"]')) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=marker&loading=async&callback=googleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  // ── Pin content factory (HTML custom marker) ────────────
  buildPinContent(point: MapPoint): HTMLElement {
    const isSelected = this.selectedPoint()?.id === point.id;
    const wrapper = document.createElement('div');
    wrapper.className = `gm-pin ${point.type}${isSelected ? ' is-selected' : ''}`;
    wrapper.innerHTML = `
      <div class="gm-pin-body">
        <span class="material-symbols-outlined gm-pin-icon">${point.icon}</span>
      </div>
    `;
    return wrapper;
  }
  // ── User actions ────────────────────────────────────────
  selectCategory(id: 'all' | MapPointType): void { this.selectedCategory.set(id); }

  selectPoint(point: MapPoint): void {
    this.selectedPoint.set(point);
    this.isDrawerOpen.set(true);
  }

  toggleDrawer(): void { this.isDrawerOpen.update(v => !v); }

  zoomIn(): void {
    const map = this.googleMap?.googleMap;
    if (map) map.setZoom((map.getZoom() ?? 14) + 1);
  }

  zoomOut(): void {
    const map = this.googleMap?.googleMap;
    if (map) map.setZoom((map.getZoom() ?? 14) - 1);
  }

  centerOnPoint(): void {
    const map = this.googleMap?.googleMap;
    const p = this.selectedPoint();
    if (!map) return;
    if (p) map.setCenter({ lat: p.lat, lng: p.lng });
    else map.setCenter(this.center());
    map.setZoom(16);
  }

  primaryAction(point: MapPoint): void {
    if (point.type === 'mission') {
      alert(`¡Te has registrado en la misión "${point.title}"!`);
    } else {
      alert(`Calculando ruta hacia "${point.title}"...`);
    }
  }

  secondaryAction(point: MapPoint): void {
    if (point.type === 'reported') {
      alert(`Gracias por verificar este reporte.`);
    } else {
      alert(`Reportando incidencia para "${point.title}"...`);
    }
  }

  trackById = (_: number, p: MapPoint) => p.id;
}

