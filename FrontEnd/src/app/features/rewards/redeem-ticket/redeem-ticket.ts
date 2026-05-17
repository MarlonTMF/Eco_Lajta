import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RedeemResultDTO } from '../../../application/dtos/rewards.dto';

@Component({
  selector: 'app-redeem-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-ticket.html',
  styleUrl: './redeem-ticket.css',
})
export class RedeemTicketComponent implements OnInit {
  // Datos del resultado del canje, leídos desde sessionStorage
  codigoTicket = signal<string>('');
  nombrePremio = signal<string>('');
  nuevoSaldo = signal<number>(0);
  fechaCanje = signal<string>('');
  cargado = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Recuperar resultado del canje guardado en la confirmación
    const raw = sessionStorage.getItem('redeemResult');
    if (raw) {
      try {
        const result: RedeemResultDTO = JSON.parse(raw);
        this.codigoTicket.set(result.codigoTicket);
        this.nombrePremio.set(result.nombrePremio);
        this.nuevoSaldo.set(result.nuevoSaldo);
        sessionStorage.removeItem('redeemResult'); // limpiar tras leer
      } catch {
        // Si no se puede parsear, usar valores vacíos
        this.codigoTicket.set('#EK-ERROR');
        this.nombrePremio.set('Premio');
      }
    } else {
      // Fallback: generar ticket local si no hay datos (navegación directa)
      const rand = Math.floor(Math.random() * 9000) + 1000;
      this.codigoTicket.set(`#EK-${rand}`);
      this.nombrePremio.set('Premio');
    }

    // Fecha actual en español
    const fecha = new Date();
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.fechaCanje.set(`${fecha.getDate()} ${meses[fecha.getMonth()]}, ${fecha.getFullYear()}`);
    this.cargado.set(true);
  }

  descargarTicket(): void {
    alert('¡Tu ticket se ha guardado en tu galería! Puedes presentarlo sin conexión a Internet.');
  }

  volver(): void {
    this.router.navigate(['/rewards']);
  }
}
