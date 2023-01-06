import { Scheduler } from '../../supports/schedule';

function factory(method: keyof Scheduler, ...args: [any?, any?, any?]) {
  return function (target: Record<string, any>, key: string | symbol) {
    const cornMap: Map<string | symbol, Scheduler> = Reflect.getMetadata('corn', target.constructor) || new Map();
    if (!cornMap.has(key)) {
      cornMap.set(key, new Scheduler());
    }
    cornMap.get(key)?.[method](...args);
    Reflect.defineMetadata('corn', cornMap, target.constructor);
  };
}


/**
 * 设定定时表达式
 * @param expression 
 * @returns 
 */
export const corn = function (expression = '* * * * *'): MethodDecorator {
  return factory('corn', expression);
};

export const everySecond = function (): MethodDecorator {
  return factory('everySecond');
};

export const everyTwoSeconds = function (): MethodDecorator {
  return factory('everyTwoSeconds');
};

export const everyThreeSeconds = function (): MethodDecorator {
  return factory('everyThreeSeconds');
};

export const everyFourSeconds = function (): MethodDecorator {
  return factory('everyFourSeconds');
};

export const everyFiveSeconds = function (): MethodDecorator {
  return factory('everyFiveSeconds');
};

export const everyTenSeconds = function (): MethodDecorator {
  return factory('everyTenSeconds');
};

export const everyFifteenSeconds = function (): MethodDecorator {
  return factory('everyFifteenSeconds');
};

export const everyThirtySeconds = function (): MethodDecorator {
  return factory('everyThirtySeconds');
};

export const everyMinute = function (): MethodDecorator {
  return factory('everyMinute');
};

export const everyTwoMinutes = function (): MethodDecorator {
  return factory('everyTwoMinutes');
};

export const everyThreeMinutes = function (): MethodDecorator {
  return factory('everyThreeMinutes');
};

export const everyFourMinutes = function (): MethodDecorator {
  return factory('everyFourMinutes');
};

export const everyFiveMinutes = function (): MethodDecorator {
  return factory('everyFiveMinutes');
};

export const everyTenMinutes = function (): MethodDecorator {
  return factory('everyTenMinutes');
};

export const everyFifteenMinutes = function (): MethodDecorator {
  return factory('everyFifteenMinutes');
};

export const everyThirtyMinutes = function (): MethodDecorator {
  return factory('everyThirtyMinutes');
};

export const hourly = function (): MethodDecorator {
  return factory('hourly');
};

export const hourlyAt = function (offset: number | number[]): MethodDecorator {
  return factory('hourlyAt', offset);
};

export const everyTwoHours = function (): MethodDecorator {
  return factory('everyTwoHours');
};

export const everyThreeHours = function (): MethodDecorator {
  return factory('everyThreeHours');
};

export const everyFourHours = function (): MethodDecorator {
  return factory('everyFourHours');
};

export const everySixHours = function (): MethodDecorator {
  return factory('everySixHours');
};

export const daily = function (): MethodDecorator {
  return factory('daily');
};

export const dailyAt = function (time: string): MethodDecorator {
  return factory('dailyAt', time);
};

export const weekdays = function (): MethodDecorator {
  return factory('weekdays');
};

export const weekends = function (): MethodDecorator {
  return factory('weekends');
};

export const mondays = function (): MethodDecorator {
  return factory('mondays');
};

export const tuesdays = function (): MethodDecorator {
  return factory('tuesdays');
};

export const wednesdays = function (): MethodDecorator {
  return factory('wednesdays');
};

export const thursdays = function (): MethodDecorator {
  return factory('thursdays');
};

export const fridays = function (): MethodDecorator {
  return factory('fridays');
};

export const saturdays = function (): MethodDecorator {
  return factory('saturdays');
};

export const sundays = function (): MethodDecorator {
  return factory('sundays');
};

export const weekly = function (): MethodDecorator {
  return factory('weekly');
};

export const weeklyOn = function (dayOfWeek: number | string, time = '0:0'): MethodDecorator {
  return factory('weeklyOn', dayOfWeek, time);
};

export const monthly = function (): MethodDecorator {
  return factory('monthly');
};

export const monthlyOn = function (dayOfMonth: string | number, time = '0:0'): MethodDecorator {
  return factory('monthlyOn', dayOfMonth, time);
};

export const quarterly = function (): MethodDecorator {
  return factory('quarterly');
};

export const yearly = function (): MethodDecorator {
  return factory('yearly');
};

export const yearlyOn = function (month: string | number = 1, dayOfMonth: string | number = 1, time = '0:0'): MethodDecorator {
  return factory('yearlyOn', month, dayOfMonth, time);
};

export const timezone = function (timezone: string): MethodDecorator {
  return factory('timezone', timezone);
};

export const runOnSingletonServer = function (): MethodDecorator {
  return factory('runOnSingletonServer');
};