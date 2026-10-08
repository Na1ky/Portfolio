import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  readonly authenticated = signal(false);

  async login(email: string, password: string): Promise<void> {
    await firstValueFrom(this.http.post('/api/admin/auth/login', { email, password }, { withCredentials: true }));
    this.authenticated.set(true);
  }

  async checkSession(): Promise<boolean> {
    try {
      await firstValueFrom(this.http.get('/api/admin/auth/session', { withCredentials: true }));
      this.authenticated.set(true);
      return true;
    } catch {
      this.authenticated.set(false);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post('/api/admin/auth/logout', {}, { withCredentials: true }));
    } finally {
      this.authenticated.set(false);
    }
  }
}
