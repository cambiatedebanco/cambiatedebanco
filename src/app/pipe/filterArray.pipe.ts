import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

    transform(items: any[], filter: Object): any {
        return items.filter( element => Number(element.idcampana) === Number(filter));
    }

}
