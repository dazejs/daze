import mz from 'moment-timezone';

/**
 * CORN 匹配器
 */
export class Matcher {
  /**
     * 匹配数组
     * @param pattern 
     * @param value 
     * @returns 
     */
  private matchPattern(pattern: string, value: number) {
    if (~pattern.indexOf(',')){
      const patterns = pattern.split(',');
      return !!~patterns.indexOf(value.toString());
    }
    return pattern === value.toString();
  }

  /**
     * 根据表达式和时间进行匹配
     * @param pattern 
     * @param date 
     * @param timezone 
     * @returns 
     */
  public match(pattern: string, date: Date, timezone?: string) {
    const _date = timezone ? mz.tz(date, timezone).toDate() : date;
    const expressions = pattern.split(' ');
    const runOnSecond = this.matchPattern(expressions[0], _date.getSeconds());
    const runOnMinute = this.matchPattern(expressions[1], _date.getMinutes());
    const runOnHour = this.matchPattern(expressions[2], _date.getHours());
    const runOnDay = this.matchPattern(expressions[3], _date.getDate());
    const runOnMonth = this.matchPattern(expressions[4], _date.getMonth() + 1);
    const runOnWeekDay = this.matchPattern(expressions[5], _date.getDay());
    return runOnSecond && runOnMinute && runOnHour && runOnDay && runOnMonth && runOnWeekDay;
  }
}