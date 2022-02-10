import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'menuFilter' })
export class MenuFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.parent_id === filter.id);
    }
}

@Pipe({ name: 'menuChild' })
export class MenuHasChild implements PipeTransform {
    transform(items: any[]): any {
        return items.filter(item => items.filter(x => x.parent_id === item.id).length > 0);
    }
}
