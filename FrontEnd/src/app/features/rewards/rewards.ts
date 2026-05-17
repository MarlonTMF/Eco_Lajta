import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  icon: string;
  category: string;
}

interface TransactionItem {
  id: string;
  title: string;
  location: string;
  category: string;
  date: string;
  amount: number;
  isPositive: boolean;
  icon: string;
  bgClass: string;
  textClass: string;
}

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css',
})
export class RewardsComponent {
  userBalance = signal<number>(2450);
  ecoHeroProgress = signal<number>(75); // 75% complete

  defaultTransactions: TransactionItem[] = [
    {
      id: 'tx-1',
      title: 'Reciclaje de PET',
      location: 'Centro de acopio Sur',
      category: 'Reciclaje',
      date: '24 Oct, 2026',
      amount: 45,
      isPositive: true,
      icon: 'recycling',
      bgClass: 'bg-primary-fixed',
      textClass: 'text-primary'
    },
    {
      id: 'tx-2',
      title: 'Canje EMAPA',
      location: 'Canje de beneficios',
      category: 'Recompensa',
      date: '22 Oct, 2026',
      amount: 200,
      isPositive: false,
      icon: 'shopping_cart',
      bgClass: 'bg-error-container',
      textClass: 'text-error'
    },
    {
      id: 'tx-3',
      title: 'Entrega de Compost',
      location: 'Residuos orgánicos',
      category: 'Reciclaje',
      date: '20 Oct, 2026',
      amount: 120,
      isPositive: true,
      icon: 'compost',
      bgClass: 'bg-primary-fixed',
      textClass: 'text-primary'
    }
  ];

  rewards = signal<RewardItem[]>([
    {
      id: 'reward-1',
      title: 'Canasta de Alimentos (EMAPA)',
      description: 'Productos básicos de alta calidad producidos por agricultores locales certificados.',
      cost: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkRHwETf8GPQYFDQ-EFEcfTycNIWJaFd4WtHJSM2iTktl43VaTsPi0iqHsLFZAZww1KUys-nOiF8iWTYEwKTFSzLPWl4y4PNWR4bbV6uxTItQntkWXpKYIkujcL4ENXq1NRHHbpH5Ov0VKo8vpLDT3p9jeO5qVVcSWfr4p718SCM1zClJC-gkZWCoJwjc1cyi4rrDJz4cho-6-ooneInem-BOGy_7DxELLDi26T56qYWv_Lpw-njAmE7i5jb5nL07z9EG_bUmXHAJ',
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
  ]);


  transactions = signal<TransactionItem[]>([]);

  constructor(private router: Router) {
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      this.userBalance.set(parseInt(savedBalance, 10));
    } else {
      localStorage.setItem('userBalance', '2450');
    }

    const savedTxs = localStorage.getItem('transactions');
    if (savedTxs) {
      this.transactions.set(JSON.parse(savedTxs));
    } else {
      const defaultTxs = this.defaultTransactions;
      localStorage.setItem('transactions', JSON.stringify(defaultTxs));
      this.transactions.set(defaultTxs);
    }
  }

  redeemReward(reward: RewardItem): void {
    if (this.userBalance() >= reward.cost) {
      this.router.navigate(['/rewards/confirm', reward.id]);
    } else {
      alert(`Lo sentimos, necesitas ${reward.cost} DP para este canje. ¡Sigue reciclando para acumular más puntos!`);
    }
  }

  addPointsMock(): void {
    const amount = 100;
    this.userBalance.update(bal => {
      const newVal = bal + amount;
      localStorage.setItem('userBalance', newVal.toString());
      return newVal;
    });
    
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: 'Bono de Escaneo EcoCam',
      location: 'Depósito Inteligente',
      category: 'Reciclaje',
      date: 'Hoy',
      amount: amount,
      isPositive: true,
      icon: 'qr_code_scanner',
      bgClass: 'bg-primary-fixed',
      textClass: 'text-primary'
    };

    this.transactions.update(txs => {
      const newTxs = [newTx, ...txs];
      localStorage.setItem('transactions', JSON.stringify(newTxs));
      return newTxs;
    });
    alert(`¡Se han añadido +100 DP de bonificación a tu billetera ecológica!`);
  }
}
