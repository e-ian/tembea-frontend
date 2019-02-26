import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenName'
})
export class ShortenNamePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (!value) {
      return '';
    }
    let { max } = args;
    let result = value;
    if (value.indexOf(' ') > 0) {
      const regExp = /[\s]+/;
      const splitStr = value.replace(regExp, ' ').split(' ');
      const last = splitStr.pop();
      const initials = splitStr.map((item) => item.charAt(0).toUpperCase()).join('.');
      result = `${initials}.${last}`;
      max += splitStr.length - 1;
    }
    const ellipse = result.length > max;
    return `${result.substring(0, max)}${(ellipse) ? '...' : ''}`;
  }

}
