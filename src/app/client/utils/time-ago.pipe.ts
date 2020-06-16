import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of this.epochs) {
      const interval = Math.floor(timeAgoInSeconds / (seconds as number));

      if (interval >= 1) {
        return {
          interval: interval,
          epoch: name,
        };
      }
    }
  };

  timeAgo = (date) => {
    const timeAgoInSeconds = Math.floor(
      ((new Date() as any) - (new Date(date) as any)) / 1000
    );
    const { interval, epoch } = this.getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';

    return `${interval} ${epoch}${suffix} ago`;
  };

  transform(value: any, args?: any): any {
    return this.timeAgo(value);
  }
}
