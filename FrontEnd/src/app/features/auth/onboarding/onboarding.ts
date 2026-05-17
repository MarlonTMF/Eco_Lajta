import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding implements OnInit, OnDestroy {
  testimonios = [
    {
      texto: '"EcoLlajta ha cambiado la forma en que mi familia ve el reciclaje. Ahora es un juego donde todos ganamos."',
      autor: 'María Gutierrez',
      rol: 'Guardiana del Valle',
    },
    {
      texto: '"Gracias a los Puntos Ecológicos, pude acceder a descuentos en mis impuestos. ¡Nunca pensé que reciclar tendría beneficios tan concretos!"',
      autor: 'Carlos Mamani',
      rol: 'Eco-Defensor, Zona Sur',
    },
    {
      texto: '"El mapa me ayuda a encontrar los puntos de acopio en minutos. Mi OTB ha mejorado mucho desde que usamos la plataforma."',
      autor: 'Sofía Mendoza',
      rol: 'Eco-Campeón, Zona Norte',
    },
  ];

  testimonioActual = signal(0);
  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.siguiente();
    }, 4500);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  siguiente() {
    this.testimonioActual.update(i => (i + 1) % this.testimonios.length);
  }

  irA(index: number) {
    this.testimonioActual.set(index);
    clearInterval(this.timer);
    this.timer = setInterval(() => this.siguiente(), 4500);
  }

  abrirGuia() {
    alert('📋 Guía de Inicio Rápido\n\n1️⃣ Crea tu cuenta con Google\n2️⃣ Lleva tus materiales reciclables al punto de acopio más cercano (Ver Mapa)\n3️⃣ El conductor registra tu entrega y acumulas Puntos Ecológicos automáticamente\n4️⃣ Canjea tus puntos por recompensas reales en la sección Recompensas\n\n¡Es así de simple! Empieza hoy.');
  }
}
