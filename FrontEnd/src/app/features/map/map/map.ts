import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  topPercent: string;
  leftPercent: string;
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
export class Map {
  isDrawerOpen = signal(false);
  selectedCategory = signal<string>('all');
  selectedPoint = signal<MapPoint | null>(null);

  categories = [
    { id: 'all', label: 'Todos', icon: 'grid_view', color: '#10b981' },
    { id: 'recycling', label: 'Puntos de Reciclaje', icon: 'recycling', color: '#0d631b' },
    { id: 'mission', label: 'Misiones Ecológicas', icon: 'groups', color: '#00639a' },
    { id: 'reported', label: 'Puntos Reportados', icon: 'warning', color: '#ba1a1a' }
  ];

  mapPoints = signal<MapPoint[]>([
    {
      id: 'point-1',
      type: 'recycling',
      title: 'Plaza Colón Point',
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
      description: 'Contenedor inteligente de botellas PET y latas de aluminio con compensación automática de Dirty Points.',
      topPercent: '45%',
      leftPercent: '52%',
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
      title: 'Limpieza del Río Rocha',
      location: 'Río Rocha, Puente Cobija',
      rewardText: '+500',
      rewardLabel: 'DP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVAiugut6VqNT0HWPZKlVL3fZ1oRJW-Zxw1b4SGAnUaXezNIjF6_2to9PDqWaewwca1J5Ui0D3BvTuwjgAACoPGcmX8fz1VrkbhK4diB98oy_UtLjyzyqj2BJbsefA0YouQjNQ_B1HKlvNNiDwqV4AAxKSOd3ZzwWhh9hgtAlhenpUjl685cDVs0mv--GDbRSTh495HtHdFlwna4CJRPjxwOGv35dB7BwKSWnTbuYS932CtoGhEX0OFY7EjovjnDupegHMA9pBEZ7',
      hoursOrDate: '15 de Oct, 08:00',
      statusText: 'Activo',
      statusClass: 'text-primary font-bold',
      capacityOrSeverity: 'Falta 24 Voluntarios',
      isSeverity: true,
      severityClass: 'severity-medium',
      description: 'Jornada masiva de reforestación y limpieza del lecho del río. El municipio proveerá guantes, bolsas y refrigerios.',
      topPercent: '25%',
      leftPercent: '43%',
      icon: 'groups',
      markerBorderClass: 'border-blue',
      markerIconClass: 'text-secondary',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVAiugut6VqNT0HWPZKlVL3fZ1oRJW-Zxw1b4SGAnUaXezNIjF6_2to9PDqWaewwca1J5Ui0D3BvTuwjgAACoPGcmX8fz1VrkbhK4diB98oy_UtLjyzyqj2BJbsefA0YouQjNQ_B1HKlvNNiDwqV4AAxKSOd3ZzwWhh9hgtAlhenpUjl685cDVs0mv--GDbRSTh495HtHdFlwna4CJRPjxwOGv35dB7BwKSWnTbuYS932CtoGhEX0OFY7EjovjnDupegHMA9pBEZ7'
      ]
    },
    {
      id: 'point-3',
      type: 'reported',
      title: 'Acumulación de Basura',
      location: 'Av. América & Villarroel',
      rewardText: '+50',
      rewardLabel: 'DP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC',
      hoursOrDate: 'Hace 3 días',
      statusText: 'Reportado',
      statusClass: 'text-danger font-bold',
      capacityOrSeverity: 'Gravedad Alta',
      isSeverity: true,
      severityClass: 'severity-high',
      description: 'Microbasural formado en la esquina norte. Hay escombros y plásticos que obstruyen la acera peatonal.',
      topPercent: '60%',
      leftPercent: '46%',
      icon: 'warning',
      markerBorderClass: 'border-red',
      markerIconClass: 'text-error',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC'
      ]
    },
    {
      id: 'point-4',
      type: 'mission',
      title: 'Eco-Rally Cala Cala',
      location: 'Plaza de Cala Cala',
      rewardText: '+300',
      rewardLabel: 'DP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC',
      hoursOrDate: '22 de Oct, 09:00',
      statusText: 'Próximamente',
      statusClass: 'text-primary',
      capacityOrSeverity: 'Faltan 12 Voluntarios',
      isSeverity: true,
      severityClass: 'severity-low',
      description: 'Competencia amistosa de recolección de botellas de vidrio y empaques de cartón por equipos vecinales.',
      topPercent: '35%',
      leftPercent: '68%',
      icon: 'sports_score',
      markerBorderClass: 'border-blue',
      markerIconClass: 'text-secondary',
      photos: []
    },
    {
      id: 'point-5',
      type: 'reported',
      title: 'Contenedor Rebasado',
      location: 'Parque Fidel Anze',
      rewardText: '+30',
      rewardLabel: 'DP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC',
      hoursOrDate: 'Hace 5 horas',
      statusText: 'En Revisión',
      statusClass: 'text-warning font-bold',
      capacityOrSeverity: 'Gravedad Media',
      isSeverity: true,
      severityClass: 'severity-medium',
      description: 'El contenedor de residuos húmedos ha superado su capacidad y hay desechos desbordados alrededor.',
      topPercent: '65%',
      leftPercent: '58%',
      icon: 'report',
      markerBorderClass: 'border-red',
      markerIconClass: 'text-error',
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
    // Open Plaza Colón point as the default selected point
    this.selectedPoint.set(this.mapPoints()[0]);
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
      alert(`¡Te has registrado con éxito para participar en la misión "${point.title}"! Te esperamos en ${point.location}.`);
    } else {
      alert(`Calculando ruta óptima para llegar a "${point.title}" en Cochabamba...`);
    }
  }

  secondaryAction(point: MapPoint): void {
    if (point.type === 'reported') {
      alert(`¡Gracias por verificar este reporte! Tu contribución ayuda a agilizar la limpieza en la América.`);
    } else {
      alert(`Reportando incidencia para "${point.title}"... El departamento técnico de EcoLlajta ha sido alertado.`);
    }
  }
}
