import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../core/auth/admin-auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="admin-shell">
      <form class="admin-card" [formGroup]="form" (ngSubmit)="submit()">
        <p class="eyebrow">AREA RISERVATA</p><h1>Accesso amministratore</h1>
        <label>Email<input type="email" formControlName="email" autocomplete="username"></label>
        <label>Password<input type="password" formControlName="password" autocomplete="current-password"></label>
        @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
        <button [disabled]="form.invalid || loading()">{{ loading() ? 'Accesso in corso…' : 'Accedi' }}</button>
      </form>
    </main>
  `,
  styles: [`
    :host{display:block;min-height:75vh;background:#0d0b0c;color:#f4f5fa}.admin-shell{min-height:75vh;display:grid;place-items:center;padding:2rem}.admin-card{width:min(100%,420px);padding:2rem;border:1px solid #3a3032;border-radius:18px;background:#1c191a;display:grid;gap:1rem}.eyebrow{color:#ffb3b3;letter-spacing:.14em;font-size:.75rem}h1{font-size:1.7rem}label{display:grid;gap:.45rem}input{padding:.8rem;border-radius:9px;border:1px solid #4a3b3e;background:#110e0f;color:white}button{padding:.85rem;border:0;border-radius:9px;background:linear-gradient(135deg,#9b1b30,#7b1113);color:white;font-weight:700}button:hover:not(:disabled){background:linear-gradient(135deg,#c63b3b,#a32a2a)}button:disabled{opacity:.6}.error{color:#ff9696}
  `],
})
export class AdminLoginComponent implements OnDestroy {
  private readonly meta = inject(Meta);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  constructor() { this.meta.updateTag({ name: 'robots', content: 'noindex,nofollow' }); }
  ngOnDestroy(): void { this.meta.updateTag({ name: 'robots', content: 'index,follow' }); }

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true); this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      const target = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(target?.startsWith('/admin') ? target : '/admin');
    } catch {
      this.error.set('Accesso non riuscito. Controlla le credenziali e riprova.');
    } finally { this.loading.set(false); }
  }
}
