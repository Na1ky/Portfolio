import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ICertificate} from '../models/certificates.model';
import {ICategory, ITechnologies} from '../models/technologies.model';
import {IGithubRepo, IProject} from '../models/projects.model';
import {environment} from '../../../environments/environment';
import {LoaderService} from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly githubBaseUrl = environment.githubBaseUrl;

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

  private githubUrl(path: string): string {
    return `${this.githubBaseUrl}/${path}`;
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
      const repos = await firstValueFrom(
        this.http.get<IGithubRepo[]>(this.githubUrl('repos'))
      );

      const githubProjects = await Promise.all(
        repos
          .filter(r => r.topics?.includes('portfolio'))
          .map(async r => {
            const project = this.mapRepoToProject(r);
            project.image_url = await this.getImages(r);
            project.downloads_url = await this.getDownloadUrl(r);
            project.created_at = r.created_at;
            return project;
          })
      );

      return githubProjects.sort(
        (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );

    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  private mapRepoToProject(r: IGithubRepo): IProject {
    return {
      id: r.id,
      name: r.name,
      description: r.description ?? '',
      image_url: [],
      technologies_used: [
        ...(r.language ? [r.language] : []),
        ...r.topics.filter(t => t !== 'portfolio'),
      ],
      html_url: r.html_url,
      website_url: r.homepage || ''
    };
  }

  private async getImages(r: IGithubRepo): Promise<string[]> {
    try {
      const url = `https://api.github.com/repos/${r.owner.login}/${r.name}/contents/preview`;
      const files = await firstValueFrom(
        this.http.get<{ name: string; download_url: string }[]>(url)
      );
      return files
        .filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f.name))
        .map(f => f.download_url);
    } catch {
      return [];
    }
  }

  private async getDownloadUrl(r: IGithubRepo): Promise<string | undefined> {
    try {
      const release = await firstValueFrom(
        this.http.get<{ html_url: string; assets: { browser_download_url: string }[] }>(
          `https://api.github.com/repos/${r.owner.login}/${r.name}/releases/latest`
        )
      );
      return release.assets[0]?.browser_download_url ?? release.html_url;
    } catch {
      return undefined;
    }
  }

  async getProjectsCount(): Promise<number> {
    try {
      const repos = await firstValueFrom(
        this.http.get<IGithubRepo[]>(this.githubUrl('repos'))
      );

      const githubProjects: IProject[] = await Promise.all(
        repos
          .filter(r => r.topics?.includes('portfolio'))
          .map(async r => {
            const project = this.mapRepoToProject(r);
            project.image_url = await this.getImages(r);
            project.downloads_url = await this.getDownloadUrl(r);
            project.created_at = r.created_at;
            return project;
          })
      );

      const data = githubProjects.length;
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
