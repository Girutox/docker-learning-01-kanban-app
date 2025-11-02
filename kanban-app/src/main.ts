/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

async function enableMocking() {
  if (environment.production) {
    enableProdMode();
    return
  }
  const { worker } = await import('./mocks/browser')
  const base = document.querySelector('base')?.getAttribute('href') || '/';
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${base}mockServiceWorker.js`,
    },
  })
}

enableMocking().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
});