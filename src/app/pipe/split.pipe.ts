import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

 
  transform(value:string, separator:string):string {
    if(value=='' || value == null){
      return '';
    }
    let splits = value.split(separator);
    if(splits.length > 1) {
      return splits[0];
    } else {
      return '';
    }
  }

}
