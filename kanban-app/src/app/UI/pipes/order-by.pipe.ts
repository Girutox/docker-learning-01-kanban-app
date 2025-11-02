import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], field: string, direction: 'asc' | 'desc' = 'asc') {
    if (!value || !field) {
      return value;
    }

    return value.sort((a, b) => {
      if (a[field] < b[field]) {
        return direction == 'asc' ? -1 : 1;
      } else if (a[field] > b[field]) {
        return direction == 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

}
