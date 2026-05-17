import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService, Mission } from '../../../shared/services/mission.service';

@Component({
  selector: 'app-explore-missions',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './explore-missions.html',
  styleUrl: './explore-missions.css',
})
export class ExploreMissions implements OnInit {
  private missionService = inject(MissionService);

  missions = signal<Mission[]>([]);
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('Todas');

  ngOnInit(): void {
    this.missionService.getAll().subscribe({
      next: (data) => {
        this.missions.set(data);
      },
      error: (err) => {
        console.error('Error loading missions:', err);
      }
    });
  }

  // Helper to map dynamic high-fidelity images based on keywords
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
    // Default eco-friendly image
    return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80';
  }

  // Format dynamic dates (e.g. "24 Ago", "14 Oct")
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

  // Filtered list based on both category selection and search term
  filteredMissions = computed(() => {
    let list = this.missions();
    const cat = this.selectedCategory();
    const search = this.searchTerm().trim().toLowerCase();

    // 1. Category Filter
    if (cat !== 'Todas') {
      list = list.filter(m => {
        const title = m.title.toLowerCase();
        const desc = m.description.toLowerCase();
        if (cat === 'Reforestación') {
          return title.includes('reforest') || title.includes('arbol') || title.includes('árbol') || desc.includes('reforest') || desc.includes('arbol') || desc.includes('árbol');
        }
        if (cat === 'Limpieza') {
          return title.includes('limp') || title.includes('basur') || title.includes('río') || title.includes('rio') || desc.includes('limp') || desc.includes('basur') || desc.includes('río') || desc.includes('rio');
        }
        return false;
      });
    }

    // 2. Search Term Filter
    if (search) {
      list = list.filter(m => 
        m.title.toLowerCase().includes(search) || 
        m.description.toLowerCase().includes(search) || 
        m.locationName.toLowerCase().includes(search)
      );
    }

    return list;
  });

  // Featured Mission: the first one in the list (or highest points)
  featuredMission = computed(() => {
    const list = this.filteredMissions();
    return list.length > 0 ? list[0] : null;
  });

  // Cerca de ti: all other missions except the featured one
  nearbyMissions = computed(() => {
    const list = this.filteredMissions();
    return list.length > 1 ? list.slice(1) : [];
  });

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }
}
