import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { Router } from '@angular/router';

type Entity = 'projects' | 'certificates' | 'technologies';
type Item = Record<string, unknown> & { _id: string | number };
const config: Record<Entity, { label: string; fields: string[]; required: string[] }> = {
  projects: { label: 'Progetti', fields: ['title', 'description', 'details', 'image_url', 'technologies_used', 'demo_url', 'download'], required: ['title', 'description'] },
  certificates: { label: 'Certificazioni', fields: ['name', 'issuer_name', 'date_achieved', 'image_url', 'pdf_url'], required: ['name'] },
  technologies: { label: 'Tecnologie', fields: ['name', 'icon_url', 'description', 'category'], required: ['name'] },
};

@Component({
  standalone: true, imports: [ReactiveFormsModule],
  template: `
    <main class="admin-page">
      <header><div><p class="eyebrow">PORTFOLIO / ADMIN</p><h1>Gestione contenuti</h1></div><button class="secondary" (click)="logout()">Esci</button></header>
      <nav class="tabs">@for (key of entities; track key) { <button [class.active]="entity() === key" (click)="select(key)">{{ labels[key] }}</button> }</nav>
      <section class="panel">
        <div class="toolbar"><input aria-label="Cerca" placeholder="Cerca contenuti…" [value]="search()" (input)="search.set($any($event.target).value); page.set(1); load()"><select aria-label="Ordina per" [value]="sortBy()" (change)="sortBy.set($any($event.target).value); load()">@for (field of sortableFields(); track field) { <option [value]="field">{{ field }}</option> }</select><button class="secondary" (click)="sortOrder.set(sortOrder() === 'desc' ? 'asc' : 'desc'); load()">{{ sortOrder() === 'desc' ? '↓' : '↑' }}</button><button (click)="newItem()">Nuovo contenuto</button></div>
        @if (message()) { <p class="message" role="status">{{ message() }}</p> }
        @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
        @if (loading()) { <p>Caricamento…</p> } @else {
          <div class="list">@for (item of items(); track item._id) { <article><div><strong>{{ title(item) }}</strong><small>ID: {{ item._id }}</small></div><div class="actions"><button class="secondary" (click)="edit(item)">Modifica</button><button class="danger" (click)="remove(item)">Elimina</button></div></article> } @empty { <p>Nessun contenuto trovato.</p> }</div>
          <footer><button class="secondary" [disabled]="page() <= 1" (click)="changePage(-1)">Precedente</button><span>Pagina {{ page() }} / {{ pages() }}</span><button class="secondary" [disabled]="page() >= pages()" (click)="changePage(1)">Successiva</button></footer>
        }
      </section>
      @if (formOpen()) { <div class="overlay"><form class="editor" [formGroup]="form" (ngSubmit)="save()"><h2>{{ editing() ? 'Modifica' : 'Crea' }} {{ labels[entity()] }}</h2>
        @for (field of fields(); track field) { <label>{{ field }} @if (field === 'details' || field === 'description') { <textarea [formControlName]="field" rows="3"></textarea> } @else { <input [formControlName]="field" [type]="field.includes('date') ? 'date' : 'text'"> } @if (isImageField(field)) { <input type="file" accept="image/jpeg,image/png,image/webp" (change)="uploadImage($event, field)"> @if (preview(field)) { <img class="preview" [src]="preview(field)" alt="Anteprima immagine"> } }</label> }
        <p class="hint">Per campi array (immagini o tecnologie), inserisci i valori separati da virgole. Categoria tecnologia: inserisci un oggetto JSON con id e name.</p>
        @if (error()) { <p class="error">{{ error() }}</p> }<div class="actions"><button type="button" class="secondary" (click)="formOpen.set(false)">Annulla</button><button [disabled]="form.invalid || loading()">{{ loading() ? 'Salvataggio…' : 'Salva' }}</button></div>
      </form></div> }
    </main>
  `,
  styles: [`
    :host{display:block;background:#0d0b0c;color:#eef0f8;min-height:80vh}.admin-page{max-width:1100px;margin:auto;padding:3rem 1.2rem}header,.toolbar,article,.actions,.panel footer{display:flex;align-items:center;justify-content:space-between;gap:1rem}h1{font-size:2rem;margin:.25rem 0 1.5rem}.eyebrow,small,.hint{color:#c5babb}.tabs{display:flex;gap:.5rem;margin-bottom:1rem}.tabs button,.secondary{background:#292324;color:#e9ecf5}.tabs button,.panel button,.editor button{border:0;border-radius:8px;padding:.65rem 1rem;cursor:pointer}.tabs .active,.toolbar>button,.editor button[type=submit],.editor button:not(.secondary){background:linear-gradient(135deg,#9b1b30,#7b1113);color:white}.tabs .active:hover,.toolbar>button:hover,.editor button:not(.secondary):hover{background:linear-gradient(135deg,#c63b3b,#a32a2a)}.panel{padding:1.2rem;background:#1c191a;border:1px solid #383031;border-radius:14px}.toolbar{margin-bottom:1rem}.toolbar input{flex:1}.list article{padding:1rem 0;border-top:1px solid #383031}article>div:first-child{display:grid;gap:.3rem}.actions{justify-content:flex-end}input,textarea{width:100%;padding:.7rem;border-radius:8px;border:1px solid #4a3b3e;background:#110e0f;color:white}.panel footer{margin-top:1rem;justify-content:center}.overlay{position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:1rem;z-index:20}.editor{width:min(100%,640px);max-height:90vh;overflow:auto;background:#1c191a;padding:1.5rem;border:1px solid #4a3b3e;border-radius:14px;display:grid;gap:.8rem}.editor label{display:grid;gap:.35rem}.editor .actions{margin-top:.5rem}.danger{background:#7e3340;color:#fff}.error{color:#ff9696}.message{color:#a3e8bd}.hint{font-size:.85rem}.preview{max-width:180px;max-height:130px;object-fit:contain;border-radius:8px}@media(max-width:600px){.admin-page{padding:2rem .8rem}header{align-items:flex-start}.actions{gap:.4rem}article{align-items:flex-start}.tabs{overflow:auto}}
  `],
})
export class AdminConsoleComponent implements OnDestroy {
  private readonly meta = inject(Meta); private readonly http = inject(HttpClient); private readonly fb = inject(FormBuilder); private readonly auth = inject(AdminAuthService); private readonly router = inject(Router);
  readonly entities: Entity[] = ['projects', 'certificates', 'technologies']; readonly labels = { projects: 'Progetti', certificates: 'Certificazioni', technologies: 'Tecnologie' };
  readonly entity = signal<Entity>('projects'); readonly items = signal<Item[]>([]); readonly page = signal(1); readonly pages = signal(1); readonly search = signal(''); readonly sortBy = signal('date_achieved'); readonly sortOrder = signal<'asc' | 'desc'>('desc'); readonly loading = signal(false); readonly error = signal(''); readonly message = signal(''); readonly formOpen = signal(false); readonly editing = signal<Item | null>(null);
  form = this.fb.group<Record<string, any>>({});

  constructor() { this.meta.updateTag({ name: 'robots', content: 'noindex,nofollow' }); void this.load(); }
  ngOnDestroy(): void { this.meta.updateTag({ name: 'robots', content: 'index,follow' }); }
  fields(): string[] { return config[this.entity()].fields; }
  isImageField(field: string): boolean { return ['image_url', 'icon_url'].includes(field); }
  preview(field: string): string { const value = this.form.controls[field]?.value; const first = Array.isArray(value) ? String(value[0] ?? '') : typeof value === 'string' ? value.split(',')[0].trim() : ''; return /^https:\/\//.test(first) ? first : ''; }
  title(item: Item): string { return String(item['title'] ?? item['name'] ?? 'Senza titolo'); }
  sortableFields(): string[] { return [...new Set([...(config[this.entity()].fields), ...(this.entity() === 'projects' || this.entity() === 'certificates' ? ['date_achieved'] : [])])]; }
  select(value: Entity): void { this.entity.set(value); this.page.set(1); this.sortBy.set(value === 'projects' || value === 'certificates' ? 'date_achieved' : 'name'); this.message.set(''); this.setupForm(); void this.load(); }
  async load(): Promise<void> {
    this.loading.set(true); this.error.set('');
    try {
      const params = new HttpParams().set('page', this.page()).set('limit', 10).set('search', this.search()).set('sortBy', this.sortBy()).set('sortOrder', this.sortOrder());
      const result = await firstValueFrom(this.http.get<{ items: Item[]; pages: number }>(`/api/admin/${this.entity()}`, { params, withCredentials: true }));
      this.items.set(result.items); this.pages.set(Math.max(1, result.pages));
    } catch { this.error.set('Impossibile caricare i contenuti. Verifica la sessione e riprova.'); }
    finally { this.loading.set(false); }
  }
  changePage(delta: number): void { this.page.update((value) => value + delta); void this.load(); }
  setupForm(value: Item | null = null): void {
    const controls: Record<string, any> = {};
    for (const field of this.fields()) {
      let initial = value?.[field] ?? '';
      if (Array.isArray(initial)) initial = initial.join(', ');
      if (field === 'category' && initial && typeof initial === 'object') initial = JSON.stringify(initial);
      controls[field] = [initial, config[this.entity()].required.includes(field) ? Validators.required : []];
    }
    this.form = this.fb.group(controls); this.editing.set(value); this.formOpen.set(true); this.error.set('');
  }
  newItem(): void { this.setupForm(); }
  edit(item: Item): void { this.setupForm(item); }
  private payload(): Record<string, unknown> {
    const data = { ...this.form.getRawValue() } as Record<string, unknown>;
    for (const key of ['image_url', 'technologies_used']) if (typeof data[key] === 'string') data[key] = (data[key] as string).split(',').map((part) => part.trim()).filter(Boolean);
    if (this.entity() === 'technologies' && typeof data['category'] === 'string' && data['category']) { try { data['category'] = JSON.parse(data['category'] as string); } catch { throw new Error('La categoria deve essere JSON valido.'); } }
    return data;
  }
  async save(): Promise<void> {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true); this.error.set('');
    try {
      const data = this.payload(); const item = this.editing();
      if (item) await firstValueFrom(this.http.put(`/api/admin/${this.entity()}/${item._id}`, data, { withCredentials: true }));
      else await firstValueFrom(this.http.post(`/api/admin/${this.entity()}`, data, { withCredentials: true }));
      this.formOpen.set(false); this.message.set('Contenuto salvato.'); await this.load();
    } catch (error) { this.error.set(error instanceof Error && error.message.includes('JSON') ? error.message : 'Salvataggio non riuscito. Controlla i campi e riprova.'); }
    finally { this.loading.set(false); }
  }
  async uploadImage(event: Event, field: string): Promise<void> {
    const input = event.target as HTMLInputElement; const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { this.error.set('L’immagine deve essere inferiore a 5 MB.'); input.value = ''; return; }
    this.loading.set(true); this.error.set('');
    try {
      const signature = await firstValueFrom(this.http.post<{ cloudName: string; apiKey: string; timestamp: number; signature: string; folder: string; allowedFormats: string }>('/api/admin/upload-signature', {}, { withCredentials: true }));
      const form = new FormData(); form.append('file', file); form.append('api_key', signature.apiKey); form.append('timestamp', String(signature.timestamp)); form.append('signature', signature.signature); form.append('folder', signature.folder); form.append('allowed_formats', signature.allowedFormats);
      const uploaded = await firstValueFrom(this.http.post<{ secure_url: string }>(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, form));
      const control = this.form.controls[field];
      if (field === 'image_url' && this.entity() === 'projects') { const current = String(control.value ?? '').split(',').map((url) => url.trim()).filter(Boolean); control.setValue([...current, uploaded.secure_url].join(', ')); }
      else control.setValue(uploaded.secure_url);
      this.message.set('Immagine caricata e pronta per il salvataggio.');
    } catch { this.error.set('Upload non riuscito. Verifica la configurazione Cloudinary e riprova.'); }
    finally { this.loading.set(false); input.value = ''; }
  }
  async remove(item: Item): Promise<void> {
    if (!window.confirm(`Eliminare “${this.title(item)}”? L’operazione è definitiva.`)) return;
    try { await firstValueFrom(this.http.delete(`/api/admin/${this.entity()}/${item._id}`, { withCredentials: true })); this.message.set('Contenuto eliminato.'); await this.load(); }
    catch { this.error.set('Eliminazione non riuscita. Verifica la sessione e riprova.'); }
  }
  async logout(): Promise<void> { await this.auth.logout(); await this.router.navigate(['/admin/login']); }
}
