import { Injectable } from '@angular/core';
import jsonGlobals from './globals.json';

@Injectable()
export class Globals {
  prop: any = jsonGlobals;
}
