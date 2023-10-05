export class GridColumn {
  field?: string;
  header?: string;
  width?: string;
  visible? = true;
  sort? = true;
  thWidth?: string;
  dataType?:
    | 'date'
    | 'datetime'
    | 'html'
    | 'string'
    | 'number'
    | 'boolean'
    | 'enum'
    | string = 'string';

  constructor(init?: GridColumn) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}

export class ActionItem {
  field?: string;
  name?: string;
  code?: string;
  onClick?: Function;
  onVisible?: Function;
  visible? = true;
  class? = '';
  tooltip? = '';
  allowRouter?: Array<string>;
  constructor(init?: ActionItem) {
    for (const key in init) {
      this[key] = init[key];
    }
  }
}
