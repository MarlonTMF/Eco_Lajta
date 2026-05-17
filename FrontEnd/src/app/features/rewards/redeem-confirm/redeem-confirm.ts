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
}

@Component({
  selector: 'app-redeem-confirm',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-confirm.html',
  styleUrl: './redeem-confirm.css',
})
export class RedeemConfirmComponent implements OnInit {
  rewardId = signal<string>('reward-1');
  reward = signal<RewardItem | null>(null);
  
  // Consistent with Mateo Velasco profile data (2,450 DP)
  currentBalance = signal<number>(2450);
  finalBalance = signal<number>(2000);

  rewardsList: RewardItem[] = [
    {
      id: 'reward-1',
      title: 'Canasta de Alimentos (EMAPA)',
      description: 'Productos básicos de alta calidad producidos por agricultores locales certificados.',
      cost: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3CjGn3qQf_OHRYVQl42weDU42v_otjory5h7iuErm2Rr5QW2tr1JivdykwzQQRme-04a32dd1j4SqNB0ersGMLz3aJZ7pQccOJGobI_w3_2m4gYx3o4rzueek_Dmnwq2EE9m-Or2OkpcgDy5j2YIm1TyVCUjhw5078nr3qZR_OqAMA-IkG94i_VWDCOQBS9S9buHCcKly49cZYFDimjzRUpjCIrDujxqbxYGD2hxQ0TmgQNkO2Y_ocAHNUA5MsCMvafBDXSSI2PU',
      icon: 'shopping_basket',
      category: 'Alimentos'
    },
    {
      id: 'reward-2',
      title: 'Descuento Predial (Municipio)',
      description: 'Obtén un 15% de descuento en tus impuestos prediales anuales por tu compromiso ambiental en Cochabamba.',
      cost: 800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD23z8T_-kN-0e-RWhgwxLYtOqthq7A-5s-XANI62F1LuNOSFhnFcgBYumwSjAhcNeHCaw1z--NUnkx5c9Q428UnW1BQU0DImQ9bz-QNxj303-IGtP26Criiel_xbdlvgrFg3pFecUnGZ7LuB0qBmk9cS4l1eUCj9gDsv1rmOroWq9cZHRdCAEteg0kwNDVHIC1kK0qG3UGhK-KMUcCqmtvlfm7tGnNObL91vJxC0-TRw7vnhNlyXpE0hcQY5iXFcg6jQN5r-dbMlDi',
      icon: 'receipt_long',
      category: 'Impuestos'
    },
    {
      id: 'reward-3',
      title: 'Score Crediticio (Banco Verde)',
      description: 'Mejora tu calificación crediticia para préstamos de vivienda sostenible con tus puntos de reciclaje.',
      cost: 1200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLVNMufydUnRCOCLhs6U5zvFSFG8S-WMCfGE_hKuaAGdenie5Z0j_lUxCiDXwY5Y6qTzuBkUhw3y0-Q5PRQ1_YU1ay3MJNs2M5CuVNJsTcT0yHNlB2LvSBK63tnNrqycT60eu2Y4zrotJqI6RtZtu7jqiLev-9h6G6Jf4ARnt6mw-mnspF-iGGL85S5ojnSEMCECi-hAwd_qd4FTiDL1tcj4WE4v4dL88zg5JieaLflKLtL-tOkYirZmoVSDB8xr_9psOBJfz_QzwQ',
      icon: 'trending_up',
      category: 'Finanzas'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      this.currentBalance.set(parseInt(savedBalance, 10));
    } else {
      localStorage.setItem('userBalance', '2450');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rewardId.set(id);
    }

    const foundReward = this.rewardsList.find(r => r.id === this.rewardId());
    if (foundReward) {
      this.reward.set(foundReward);
      this.finalBalance.set(this.currentBalance() - foundReward.cost);
    } else {
      // Fallback
      this.reward.set(this.rewardsList[0]);
      this.finalBalance.set(this.currentBalance() - this.rewardsList[0].cost);
    }
  }

  confirmRedeem(): void {
    const activeReward = this.reward();
    if (!activeReward) return;

    if (this.currentBalance() < activeReward.cost) {
      alert('Puntos insuficientes para confirmar este canje.');
      return;
    }

    // Deduce points and save to persist across components
    const newBalance = this.currentBalance() - activeReward.cost;
    localStorage.setItem('userBalance', newBalance.toString());

    // Register transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      title: activeReward.title,
      location: 'Canje de beneficios',
      category: 'Recompensa',
      date: 'Hoy',
      amount: activeReward.cost,
      isPositive: false,
      icon: activeReward.icon,
      bgClass: 'bg-error-container',
      textClass: 'text-error'
    };

    const savedTxsStr = localStorage.getItem('transactions');
    if (savedTxsStr) {
      const savedTxs = JSON.parse(savedTxsStr);
      savedTxs.unshift(newTx);
      localStorage.setItem('transactions', JSON.stringify(savedTxs));
    }

    this.router.navigate(['/rewards/ticket', activeReward.id]);
  }

  cancel(): void {
    this.router.navigate(['/rewards']);
  }
}
