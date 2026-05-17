// shared/pipes/dirty-points-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dirtyPoints',
  standalone: true
})
export class DirtyPointsPipe implements PipeTransform {
  transform(value: number | string, showLabel: boolean = true): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    
    const formatted = num.toLocaleString('es-BO');
    return showLabel ? `${formatted} Dirty Points` : formatted;
  }
}
