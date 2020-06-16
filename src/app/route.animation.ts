import {
  transition,
  style,
  trigger,
  animate,
  state,
  group,
} from '@angular/animations';

export let slideAnimation = trigger('slideAnimation', [
  transition('void => *', [
    style({
      transform: 'translate3d(0, 10%, 0)',
      opacity: 0,
    }),
    group([
      animate(
        '500ms ease-in-out',
        style({
          //transform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          opacity: 1,
        })
      ),
      animate(
        '500ms 150ms ease-in-out',
        style({
          opacity: 1,
        })
      ),
    ]),
  ]),
]);

export let routeAnimation = trigger('routeAnimation', [
  transition('void => *', [
    style({
      opacity: 0,
    }),
    animate(
      '400ms 150ms ease-in-out',
      style({
        opacity: 1,
      })
    ),
  ]),
]);

export let fadeInAnimation = trigger('fadeInAnimation', [
  transition('void => *', [
    style({
      opacity: 0,
    }),
    animate(
      '400ms 150ms ease-in-out',
      style({
        opacity: 1,
      })
    ),
  ]),
]);
