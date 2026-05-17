import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-redeem-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-ticket.html',
  styleUrl: './redeem-ticket.css',
})
export class RedeemTicketComponent implements OnInit {
  private router = inject(Router);

  ticketId     = signal<string>('');
  nombrePremio = signal<string>('');
  fechaCanje   = signal<string>('');
  cargado      = signal<boolean>(false);
  // Alias para compatibilidad con el HTML existente
  codigoTicket = this.ticketId;
  nuevoSaldo   = signal<number>(0);

  ngOnInit(): void {
    // Leer datos pasados por Router state desde redeem-confirm
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.ticketId.set(state?.['ticketId'] ?? `#EK-${Math.floor(Math.random() * 9000) + 1000}`);
    this.nombrePremio.set(state?.['nombrePremio'] ?? 'Premio');

    const fecha  = new Date();
    const meses  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
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
