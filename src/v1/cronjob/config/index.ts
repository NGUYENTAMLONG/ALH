import { Moment } from 'moment';

export interface ICronTime {
  rule: string | Date | Moment | any;
  signature: string;
}
export const CronTime = {
  EveryDayAtZeroAM: {
    rule: '0 0 0 * * *',
    signature: 'everyDayAtZeroAm',
  },
  EveryDayAtTwoAm: {
    rule: '0 0 2 * * *',
    signature: 'everyDayAtTwoAm',
  },
  EveryDayAtSevenAm: {
    rule: '0 0 7 * * *',
    signature: 'everyDayAtSevenAm',
  },
  EveryDayAtEightAm: {
    rule: '0 0 8 * * *',
    signature: 'everyDayAtEightAm',
  },
  EveryDayAtNineAm: {
    rule: '0 0 9 * * *',
    signature: 'everyDayAtNineAm',
  },
  EveryDayAtSixAm: {
    rule: '0 0 6 * * *',
    signature: 'everyDayAtSixAm',
  },
  EveryHour: {
    rule: '0 0 * * * *',
    signature: 'everyHourJobs',
  },
  EveryTwoHour: {
    rule: '0 */2 * * *',
    signature: 'everyTwoHours',
  },
  EveryDay: {
    rule: '0 0 16 * * *',
    signature: 'everyDayJobs',
  },
  EveryWednesday: {
    rule: '0 0 16 * * 3',
    signature: 'everyWednesdayJobs',
  },
  EverySecond: {
    rule: '* * * * * *',
    signature: 'everySecondJobs',
  },
  EveryTwentySecondSecond: {
    rule: '*/20 * * * * *',
    signature: 'everySecondJobs',
  },
  EveryMin: {
    rule: '* * * * *',
    signature: 'everyMinuteJobs',
  },
  PerThreeSecond: {
    rule: '*/3 * * * * *',
    signature: 'perThreeSecond',
  },
  EveryFiveMin: {
    rule: '*/5 * * * *',
    signature: 'everyFiveMinutesJobs',
  },
};

export enum GlobalTime {
  AsiaHoChiMinh = 'Asia/Ho_Chi_Minh',
}
