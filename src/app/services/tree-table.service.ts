import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreeTableService<T> {
  constructor() { }

  collapse(list: T[], data: T, $event: boolean, key: string): void {
    if (!$event) {
      if (data['child']) {
        data['child'].forEach((item) => {
          const target = list.find((a) => a[key] === item[key])!;
          target['expand'] = false;
          this.collapse(list, target, false, key);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: T, key: string): T[] {
    const stack: T[] = [];
    const array: T[] = [];
    const hashMap = new Map<string, boolean>();
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array, key);
      if (node['child']?.length) {
        for (let i = node['child'].length - 1; i >= 0; i--) {
          stack.push({
            ...node['child'][i],
            level: node['level']! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(node: T, hashMap: Map<string, boolean>, list: T[], key: string): void {
    if (!hashMap.get(node[key])) {
      hashMap.set(node[key], true);
      list.push(node);
    }
  }
}
