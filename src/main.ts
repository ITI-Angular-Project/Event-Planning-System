import { register } from 'swiper/element/bundle';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './assets/scripts/data-bootstrap.js';
register();
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
