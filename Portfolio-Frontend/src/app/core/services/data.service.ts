import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ICertificate } from '../models/certificates.model';
import { ICategory, ITechnologies } from '../models/technologies.model';
import { IProject } from '../models/projects.model';
import { environment } from '../../../environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) {}

  get isLoading() {
    return this.loaderService.isLoading;
  }

  private apiUrl(path: string): string {
    return `${this.apiBaseUrl}/api/${path}`;
  }

  private getCertificateTimestamp(certificate: ICertificate): number {
    const dateValue = certificate.date_achieved || certificate.created_at;
    const timestamp = new Date(dateValue).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  async getCertificates(): Promise<ICertificate[]> {
    try {
      const data = await firstValueFrom(this.http.get<ICertificate[]>(this.apiUrl('certificates')));
      return (data ?? []).slice().sort((a, b) => this.getCertificateTimestamp(b) - this.getCertificateTimestamp(a));
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }
  }

  async getCertificatesCount(): Promise<number> {
    try {
      const data = await firstValueFrom(this.http.get<number>(this.apiUrl('certificates/count')));
      return data ?? 0;
    } catch (error) {
      console.error('Error fetching certificates count:', error);
      return 0;
    }
  }

  async getProjects(): Promise<IProject[]> {
    try {
      const data = await firstValueFrom(this.http.get<IProject[]>(this.apiUrl('projects')));
      return data ?? [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getProjectsCount(): Promise<number> {
    try {
      const data = await firstValueFrom(this.http.get<number>(this.apiUrl('projects/count')));
      return data ?? 0;
    } catch (error) {
      console.error('Error fetching projects count:', error);
      return 0;
    }
  }

  async getTechnologies(): Promise<ITechnologies[]> {
    try {
      const data = await firstValueFrom(this.http.get<ITechnologies[]>(this.apiUrl('technologies')));
      return data ?? [];
    } catch (error) {
      console.error('Error fetching technologies:', error);
      return [];
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const data = await firstValueFrom(this.http.get<ICategory[]>(this.apiUrl('technologies/categories')));
      return data ?? [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}
