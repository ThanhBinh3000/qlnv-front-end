import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-template-error',
  templateUrl: './template-error.component.html',
  styleUrls: ['./template-error.component.scss']
})
export class TemplateErrorComponent implements OnInit {
  @Input() control
  constructor(
    public globals: Globals
  ) { }

  ngOnInit(): void {
  }

}
