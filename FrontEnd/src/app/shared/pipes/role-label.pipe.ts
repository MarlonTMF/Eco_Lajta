import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleLabel',
  standalone: true
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: string | undefined | null): string {
    const labels: Record<string, string> = {
      'ROLE_CITIZEN': 'Ciudadano',
      'ROLE_ADMIN': 'Administrador',
      'ROLE_TRUCK_DRIVER': 'Conductor',
      'ROLE_WORKER': 'Trabajador'
    };
    return labels[role ?? ''] ?? role ?? '';
  }
}