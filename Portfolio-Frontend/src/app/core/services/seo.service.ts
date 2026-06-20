import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoOptions {
    title: string;
    description: string;
    url: string;
    image?: string;
    keywords?: string;
    siteName?: string;
    locale?: string;
    type?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly defaultImage = 'https://nicolas-dominici.it/assets/preview.png';
    private readonly defaultSiteName = 'Dominici Nicolas Portfolio';
    private readonly defaultLocale = 'it_IT';
    private readonly defaultType = 'website';

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private document: Document
    ) { }

    setPageSeo(options: SeoOptions): void {
        const image = options.image ?? this.defaultImage;
        const siteName = options.siteName ?? this.defaultSiteName;
        const locale = options.locale ?? this.defaultLocale;
        const type = options.type ?? this.defaultType;

        this.title.setTitle(options.title);
        this.updateCanonical(options.url);

        this.meta.updateTag({ name: 'description', content: options.description });
        if (options.keywords) {
            this.meta.updateTag({ name: 'keywords', content: options.keywords });
        }
        this.meta.updateTag({ name: 'author', content: 'Dominici Nicolas' });
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });

        this.meta.updateTag({ property: 'og:title', content: options.title });
        this.meta.updateTag({ property: 'og:description', content: options.description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: options.url });
        this.meta.updateTag({ property: 'og:type', content: type });
        this.meta.updateTag({ property: 'og:site_name', content: siteName });
        this.meta.updateTag({ property: 'og:locale', content: locale });

        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: options.title });
        this.meta.updateTag({ name: 'twitter:description', content: options.description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
        this.meta.updateTag({ name: 'twitter:url', content: options.url });
    }

    private updateCanonical(url: string): void {
        let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }
}
