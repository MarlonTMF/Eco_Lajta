import { Component, signal, computed, effect, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var L: any; // Leaflet global declaration

interface MapPoint {
  id: string;
  type: 'recycling' | 'mission' | 'reported';
  title: string;
  location: string;
  rewardText: string;
  rewardLabel: string;
  image: string;
  hoursOrDate: string;
  statusText: string;
  statusClass: string;
  capacityOrSeverity: string;
  capacityPercentage?: number;
  isSeverity?: boolean;
  severityClass?: string;
  description: string;
  lat: number;
  lng: number;
  icon: string;
  markerBorderClass: string;
  markerIconClass: string;
  photos: string[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit, OnDestroy {
  private map: any = null;
  private markersGroup: any[] = [];
  
  isDrawerOpen = signal(false);
  selectedCategory = signal<string>('all');
  selectedPoint = signal<MapPoint | null>(null);

  categories = [
    { id: 'all', label: 'Todos', icon: 'grid_view', color: '#10b981' },
    { id: 'recycling', label: 'Puntos de Reciclaje', icon: 'recycling', color: '#0d631b' },
    { id: 'mission', label: 'Misiones EcolÃ³gicas', icon: 'groups', color: '#00639a' }
  ];

  mapPoints = signal<MapPoint[]>([
    {
      id: 'point-1',
      type: 'recycling',
      title: 'Plaza ColÃ³n Point',
      location: 'Cochabamba Centro, Zona 1',
      rewardText: '+15',
      rewardLabel: 'Tokens',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByeR3AbL6Qe1nFpIiOkavFkPREWKwENE6khjZyIh5-YovTfujR-Lr0Lm5u4tqe7SlHrrEEeHfgS-3w0NaQK5E_jrTlnlF5q68gddMU9Ck3KOHzH_R95IUTP1GzKUQUme3FWD1w6QhKVseWzhVhJaiYuyYKfBoAA7hH-a_dSc1BI7flMKebcGGreald5DiwMfYF0oYBVUY6VirUuBIIls1sQyYyk79vdlPqFOxUPTYXIDvDd_VCL7MXqlswYRuTzfhqaQZYyqgQobs9',
      hoursOrDate: '08:00 - 20:00',
      statusText: 'Open Now',
      statusClass: 'text-accent',
      capacityOrSeverity: '78% Full',
      capacityPercentage: 78,
      isSeverity: false,
      description: 'Contenedor inteligente de botellas PET y latas de aluminio con compensaciÃ³n automÃ¡tica de Puntos Ecológicos.',
      lat: -17.3935,
      lng: -66.1570,
      icon: 'recycling',
      markerBorderClass: 'border-primary',
      markerIconClass: 'text-primary',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA2HaQ0jT-QLuQm3C3-pfGv-dPAosegulTpX-MdaVjwhyFEUEbIr2_s6du0L5PoIIGTSuFlQh7SBUS2dthY1f60wcXeytuO3T5NRUvLMM79-a9Vrvsb-WRpVOpt3AeXroYVP--EWAb2BegjkNB1EC2bBcbaWjgNhWKKjV_TF8jQPnU2gmwOiMM4ZGybVD5HjwxNZMOEIWaGgPp2QBZ45lnYbTrySzyPc-jTQ1Qu9N3uS2jout5M9ghvsDjqZcT6tYM-liUrOs8d7WmR',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Z2CY8BztCGLo4Dgdd-r6EoqCW7hEg9NvxVSJ6JQuAFr3qCnXoXpd0y6iqKPalcxX5bM5FP_8BwpXjeGUphH8wLCCrUwmmDkgYupU8h6W8Pil0pD1ThL4f0xHdc_1yEkVIYWlX8f5_q83RaXeFagDR1pdjiz_pnYSwzKcGsxB77N0-VSn91s37kF384YQEgtfphHNrVo_kClawvB8DQWOq4ZDf0BUcEy9qoO_AiDEYHVFVIBSddvqstcKOjB3pXBA7OJcVOQBb9wI'
      ]
    },
    {
      id: 'point-2',
      type: 'mission',
      title: 'Limpieza del RÃ­o Rocha',
      location: 'RÃ­o Rocha, Puente Cobija',
      rewardText: '+500',
      rewardLabel: 'DP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVAiugut6VqNT0HWPZKlVL3fZ1oRJW-Zxw1b4SGAnUaXezNIjF6_2to9PDqWaewwca1J5Ui0D3BvTuwjgAACoPGcmX8fz1VrkbhK4diB98oy_UtLjyzyqj2BJbsefA0YouQjNQ_B1HKlvNNiDwqV4AAxKSOd3ZzwWhh9hgtAlhenpUjl685cDVs0mv--GDbRSTh495HtHdFlwna4CJRPjxwOGv35dB7BwKSWnTbuYS932CtoGhEX0OFY7EjovjnDupegHMA9pBEZ7',
      hoursOrDate: '15 de Oct, 08:00',
      statusText: 'Activo',
      statusClass: 'text-primary font-bold',
      capacityOrSeverity: 'Falta 24 Voluntarios',
      isSeverity: true,
      severityClass: 'severity-medium',
      description: 'Jornada masiva de reforestaciÃ³n y limpieza del lecho del rÃ­o Rocha. El municipio proveerÃ¡ guantes, bolsas y refrigerios.',
      lat: -17.3879,
      lng: -66.1645,
      icon: 'groups',
      markerBorderClass: 'border-blue',
      markerIconClass: 'text-secondary',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVAiugut6VqNT0HWPZKlVL3fZ1oRJW-Zxw1b4SGAnUaXezNIjF6_2to9PDqWaewwca1J5Ui0D3BvTuwjgAACoPGcmX8fz1VrkbhK4diB98oy_UtLjyzyqj2BJbsefA0YouQjNQ_B1HKlvNNiDwqV4AAxKSOd3ZzwWhh9hgtAlhenpUjl685cDVs0mv--GDbRSTh495HtHdFlwna4CJRPjxwOGv35dB7BwKSWnTbuYS932CtoGhEX0OFY7EjovjnDupegHMA9pBEZ7'
      ]
    },
    {
      id: 'point-4',
      type: 'mission',
      title: 'Eco-Rally Cala Cala',
      location: 'Plaza de Cala Cala',
      rewardText: '+300',
      rewardLabel: 'DP',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      hoursOrDate: '22 de Oct, 09:00',
      statusText: 'PrÃ³ximamente',
      statusClass: 'text-primary',
      capacityOrSeverity: 'Faltan 12 Voluntarios',
      isSeverity: true,
      severityClass: 'severity-low',
      description: 'Competencia vecinal amistosa de recolecciÃ³n de botellas plÃ¡sticas y vidrio en los alrededores de la histÃ³rica Plaza de Cala Cala.',
      lat: -17.3685,
      lng: -66.1601,
      icon: 'sports_score',
      markerBorderClass: 'border-blue',
      markerIconClass: 'text-secondary',
      photos: []
    }
  ]);

  // Compute filtered map points based on the active category filter signal
  filteredPoints = computed(() => {
    const activeCat = this.selectedCategory();
    if (activeCat === 'all') {
      return this.mapPoints();
    }
    return this.mapPoints().filter(point => point.type === activeCat);
  });

  constructor() {
    // Open Plaza ColÃ³n point by default
    this.selectedPoint.set(this.mapPoints()[0]);

    // Reactive effect to keep markers synchronized with the signals
    effect(() => {
      this.updateMarkers();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (typeof L === 'undefined') {
      console.warn('Leaflet script is not loaded yet. Retrying...');
      setTimeout(() => this.initMap(), 200);
      return;
    }

    // Initialize Leaflet Map centered in Cochabamba
    this.map = L.map('map', {
      zoomControl: false, // Disable native Leaflet zoom box so we can use custom stylized HTML zoom controls
      attributionControl: false
    }).setView([-17.3820, -66.1560], 14);

    // Apply elegant, clean satellite/street Voyager vector tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(this.map);

    // Initial render of markers
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map || typeof L === 'undefined') return;

    // Clear previous markers
    this.markersGroup.forEach(marker => marker.remove());
    this.markersGroup = [];

    const activePoints = this.filteredPoints();
    const selected = this.selectedPoint();

    activePoints.forEach(point => {
      const isSelected = selected?.id === point.id;

      // Premium Custom HTML Marker Pin
      const customHtml = `
        <div class="custom-leaflet-pin ${point.type} ${isSelected ? 'active-selected' : ''}">
          <div class="marker-pin ${point.markerBorderClass}">
            <span class="material-symbols-outlined icon-inside ${point.markerIconClass}">${point.icon}</span>
          </div>
          <div class="marker-label">${point.title}</div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-marker-container',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon })
        .addTo(this.map)
        .on('click', () => {
          this.selectPoint(point);
        });

      this.markersGroup.push(marker);
    });

    // Pan map to active point if selected
    if (selected) {
      this.map.panTo([selected.lat, selected.lng], { animate: true, duration: 1 });
    }
  }

  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut();
    }
  }

  centerOnPoint(): void {
    const selected = this.selectedPoint();
    if (this.map && selected) {
      this.map.setView([selected.lat, selected.lng], 16, { animate: true, duration: 1.2 });
    } else if (this.map) {
      this.map.setView([-17.3820, -66.1560], 14, { animate: true, duration: 1.2 });
    }
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(val => !val);
  }

  selectPoint(point: MapPoint): void {
    this.selectedPoint.set(point);
    this.isDrawerOpen.set(true);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  primaryAction(point: MapPoint): void {
    if (point.type === 'mission') {
      alert(`Â¡Te has registrado con Ã©xito para participar en la misiÃ³n "${point.title}"! Te esperamos en ${point.location}.`);
    } else {
      alert(`Calculando ruta Ã³ptima para llegar a "${point.title}" en Cochabamba...`);
    }
  }

  secondaryAction(point: MapPoint): void {
    if (point.type === 'reported') {
      alert(`Â¡Gracias por verificar este reporte! Tu contribuciÃ³n ayuda a agilizar la limpieza en Cochabamba.`);
    } else {
      alert(`Reportando incidencia para "${point.title}"... El departamento tÃ©cnico de EcoLlajta ha sido alertado.`);
    }
  }
}

