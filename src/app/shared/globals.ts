import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import jsonGlobals from './globals.json';

@Injectable()
export class Globals {
  prop: any = jsonGlobals;
  formatter = (value: number) => value.toLocaleString('vi-VN');
  parser = (value: string) => value.replace(/\,/g, '');
  parserInput = value => value.replaceAll(',', '.');
}
