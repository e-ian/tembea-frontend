import { ActiveTimeDirective } from './active-time.directive';
import { ElementRef } from '@angular/core';
import { AuthService } from './auth/__services__/auth.service';

describe('ActiveTimeDirective', () => {
  it('should create the directive', () => {
    const ele = document.createElement('div');
    const elementRef = new ElementRef(ele);
    const directive = new ActiveTimeDirective(elementRef);
    const time = Date.now();
    directive.resetActiveTime();

    expect(AuthService.lastActiveTime).toBe(time);
  });

  it('should init', () => {
    const ele = document.createElement('div');
    jest.spyOn(ele, 'addEventListener');
    const elementRef = new ElementRef(ele);
    const directive = new ActiveTimeDirective(elementRef);

    directive.ngOnInit();
    expect(ele.addEventListener).toHaveBeenCalledTimes(3);
  });
});
