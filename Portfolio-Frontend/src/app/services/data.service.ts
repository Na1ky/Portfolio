import { ICertificate } from './../data/certificates';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICategory, ITechnologies } from '../data/Technologies';
import { IProject } from './../data/projects';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private getCertificateTimestamp(certificate: ICertificate): number {
    const dateValue = certificate.date_achieved || certificate.created_at;
    const timestamp = new Date(dateValue).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  async getCertificates() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/certificates');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return [];
      }

      const data: ICertificate[] = await response.json();
      return (data ?? []).slice().sort((a, b) => this.getCertificateTimestamp(b) - this.getCertificateTimestamp(a));
    } catch (error) {
      console.error('Error', error);
      return [];
    }
  }

  async getCertificatesCount() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/certificates/count');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return 0;
      }

      const data: number = await response.json();
      return data ?? 0;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  }

  async getProjects() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/projects');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return [];
      }

      const data: IProject[] = await response.json();
      return data ?? [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  async getProjectsCount() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/projects/count');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return 0;
      }

      const data: number = await response.json();
      return data ?? 0;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  }

  async getTechnologies() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/technologies');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return [];
      }

      const data: ITechnologies[] = await response.json();
      return data ?? [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  async getCategories() {
    try {
      const response = await fetch('https://portfolio-server-ke9f.onrender.com/api/technologies/categories');

      if (!response.ok) {
        console.error('Internal Server error', response.statusText);
        return [];
      }

      const data: ICategory[] = await response.json();
      return data ?? [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  private _isLoading = signal(false);

  readonly isLoading = this._isLoading.asReadonly();

  show() {
    this._isLoading.set(true);
  }

  hide() {
    this._isLoading.set(false);
  }
}
