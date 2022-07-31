import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import jsonGlobals from './globals.json';

@Injectable()
export class Globals {
  prop: any = jsonGlobals;
  formatter = (value) => value ? formatNumber(value, 'vi_VN', '1.0-1') : 0;
  parser = value => value.replaceAll('.', '');
}
