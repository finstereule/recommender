
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items, value) {
    if (items) {
      return items.filter(item => {
        return item.title.toLowerCase().includes(value);
      });
    }

  }
}
