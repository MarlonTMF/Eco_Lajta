import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  icon: string;
  category: string;
  location: string;
}

@Component({
  selector: 'app-redeem-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-ticket.html',
  styleUrl: './redeem-ticket.css',
})
export class RedeemTicketComponent implements OnInit {
  rewardId = signal<string>('reward-1');
  reward = signal<RewardItem | null>(null);
  
  ticketId = signal<string>('#EK-EMAPA-7782');
  currentDate = signal<string>('24 Oct, 2026');

  rewardsList: RewardItem[] = [
    {
      id: 'reward-1',
      title: 'Canasta de Alimentos (EMAPA)',
      description: 'Productos básicos de alta calidad producidos por agricultores locales certificados.',
      cost: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3CjGn3qQf_OHRYVQl42weDU42v_otjory5h7iuErm2Rr5QW2tr1JivdykwzQQRme-04a32dd1j4SqNB0ersGMLz3aJZ7pQccOJGobI_w3_2m4gYx3o4rzueek_Dmnwq2EE9m-Or2OkpcgDy5j2YIm1TyVCUjhw5078nr3qZR_OqAMA-IkG94i_VWDCOQBS9S9buHCcKly49cZYFDimjzRUpjCIrDujxqbxYGD2hxQ0TmgQNkO2Y_ocAHNUA5MsCMvafBDXSSI2PU',
      icon: 'shopping_basket',
      category: 'Alimentos',
      location: 'Centros EMAPA Autorizados'
    },
    {
      id: 'reward-2',
      title: 'Descuento Predial (Municipio)',
      description: 'Obtén un 15% de descuento en tus impuestos prediales anuales por tu compromiso ambiental en Cochabamba.',
      cost: 800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD23z8T_-kN-0e-RWhgwxLYtOqthq7A-5s-XANI62F1LuNOSFhnFcgBYumwSjAhcNeHCaw1z--NUnkx5c9Q428UnW1BQU0DImQ9bz-QNxj303-IGtP26Criiel_xbdlvgrFg3pFecUnGZ7LuB0qBmk9cS4l1eUCj9gDsv1rmOroWq9cZHRdCAEteg0kwNDVHIC1kK0qG3UGhK-KMUcCqmtvlfm7tGnNObL91vJxC0-TRw7vnhNlyXpE0hcQY5iXFcg6jQN5r-dbMlDi',
      icon: 'receipt_long',
      category: 'Impuestos',
      location: 'Alcaldía de Cochabamba (Plaza Colón)'
    },
    {
      id: 'reward-3',
      title: 'Score Crediticio (Banco Verde)',
      description: 'Mejora tu calificación crediticia para préstamos de vivienda sostenible con tus puntos de reciclaje.',
      cost: 1200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLVNMufydUnRCOCLhs6U5zvFSFG8S-WMCfGE_hKuaAGdenie5Z0j_lUxCiDXwY5Y6qTzuBkUhw3y0-Q5PRQ1_YU1ay3MJNs2M5CuVNJsTcT0yHNlB2LvSBK63tnNrqycT60eu2Y4zrotJqI6RtZtu7jqiLev-9h6G6Jf4ARnt6mw-mnspF-iGGL85S5ojnSEMCECi-hAwd_qd4FTiDL1tcj4WE4v4dL88zg5JieaLflKLtL-tOkYirZmoVSDB8xr_9psOBJfz_QzwQ',
      icon: 'trending_up',
      category: 'Finanzas',
      location: 'Banco Unión / Sucursal Central'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rewardId.set(id);
    }

    const foundReward = this.rewardsList.find(r => r.id === this.rewardId());
    if (foundReward) {
      this.reward.set(foundReward);
    } else {
      this.reward.set(this.rewardsList[0]);
    }

    // Set a dynamic ticket ID and Date
    const rand = Math.floor(Math.random() * 9000) + 1000;
    const codePrefix = this.reward()?.category === 'Alimentos' ? 'EMAPA' : 
                       this.reward()?.category === 'Impuestos' ? 'MUN' : 'BVERDE';
    this.ticketId.set(`#EK-${codePrefix}-${rand}`);

    const date = new Date();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.currentDate.set(`${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`);
  }

  downloadTicket(): void {
    alert('¡Tu ticket se ha guardado en tu galería de imágenes de Cochabamba! Puedes presentarlo sin conexión a Internet.');
  }

  goToStart(): void {
    this.router.navigate(['/rewards']);
  }
}
