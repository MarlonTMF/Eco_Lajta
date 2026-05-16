import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

declare var lucide: any;

@Component({
  selector: 'app-map',
  imports: [RouterModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit, AfterViewInit {
  isDrawerOpen = false;
  private map: L.Map | undefined;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('leafletMap', {
      center: [-17.3935, -66.1570],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    }).addTo(this.map);

    this.addMarkers();
  }

  private addMarkers(): void {
    const plazaColonIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="map-marker-container" style="position: relative;">
            <div class="marker-pin" style="background: var(--primary); border-color: white; transform: rotate(-45deg) scale(1.1);">
                <i data-lucide="recycle" style="width: 20px; transform: rotate(45deg);"></i>
            </div>
            <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; background: white; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; box-shadow: var(--shadow);">Plaza Colón Point</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const marker1 = L.marker([-17.3935, -66.1570], { icon: plazaColonIcon }).addTo(this.map!);
    marker1.on('click', () => {
      this.isDrawerOpen = true;
    });

    const blueIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="map-marker-container" style="position: relative;">
            <div class="marker-pin" style="background: #00639a; border-color: white; width: 32px; height: 32px;">
                <i data-lucide="trash-2" style="width: 14px; transform: rotate(45deg);"></i>
            </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.marker([-17.389, -66.162], { icon: blueIcon }).addTo(this.map!);

    const redIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="map-marker-container" style="position: relative;">
            <div class="marker-pin" style="background: #ba1a1a; border-color: white; width: 32px; height: 32px;">
                <i data-lucide="alert-triangle" style="width: 14px; transform: rotate(45deg);"></i>
            </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.marker([-17.402, -66.152], { icon: redIcon }).addTo(this.map!);

    // Initialize lucide icons for newly added markers
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  panToCurrentLocation() {
    if (this.map) {
      this.map.setView([-17.3935, -66.1570], 14);
    }
  }
}
