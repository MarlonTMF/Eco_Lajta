// application/state/user.state.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserState {
  private _userName = signal<string>('Mateo V.');
  private _role = signal<'citizen' | 'admin'>('admin'); // Set to admin for testing purposes

  readonly userName = computed(() => this._userName());
  readonly role = computed(() => this._role());

  setRole(role: 'citizen' | 'admin'): void {
    this._role.set(role);
  }

  setUserName(name: string): void {
    this._userName.set(name);
  }
}
