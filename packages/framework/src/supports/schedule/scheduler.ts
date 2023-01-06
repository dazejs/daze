
/**
 * 定时器生成器
 */
export class Scheduler {
  /**
     * corn 表达式
     */
  private expression = '0 * * * * *';

  /**
     * corn 时区
     */
  private _timezone?: string;

  /**
     * 是否单例服务器运行
     */
  private _singletonServer = false;

  /**
     * 直接设置表达式
     * @param expression 
     * @returns 
     */
  public corn(expression: string) {
    this.expression = expression;
    return this;
  }

  /**
     * 每秒钟执行
     * @returns 
     */
  public everySecond() {
    return this.spliceIntoPosition(1, '*');
  }

  /**
     * 每2秒执行
     * @returns 
     */
  public everyTwoSeconds() {
    return this.spliceIntoPosition(1, '*/2');
  }

  /**
     * 每3秒执行
     * @returns 
     */
  public everyThreeSeconds() {
    return this.spliceIntoPosition(1, '*/3');
  }

  /**
     * 每4秒执行
     * @returns 
     */
  public everyFourSeconds() {
    return this.spliceIntoPosition(1, '*/4');
  }

  /**
     * 每5秒执行
     * @returns 
     */
  public everyFiveSeconds() {
    return this.spliceIntoPosition(1, '*/5');
  }

  /**
     * 每10秒执行
     * @returns 
     */
  public everyTenSeconds() {
    return this.spliceIntoPosition(1, '*/10');
  }

  /**
     * 每15秒执行
     * @returns 
     */
  public everyFifteenSeconds() {
    return this.spliceIntoPosition(1, '*/15');
  }

  /**
     * 每30秒执行
     * @returns 
     */
  public everyThirtySeconds() {
    return this.spliceIntoPosition(1, '*/30');
  }

  /**
     * 每分钟执行
     * @returns 
     */
  public everyMinute() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*');
  }

  /**
     * 每两分钟执行
     * @returns 
     */
  public everyTwoMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/2');
  }

  /**
     * 每3分钟执行
     * @returns 
     */
  public everyThreeMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/3');
  }

  /**
     * 每4分钟执行
     * @returns 
     */
  public everyFourMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/4');
  }
    

  /**
     * 每5分钟执行
     * @returns 
     */
  public everyFiveMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/5');
  }

  /**
     * 每10分钟执行
     * @returns 
     */
  public everyTenMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/10');
  }
    
  /**
     * 每15分钟执行
     * @returns 
     */
  public everyFifteenMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/15');
  }

  /**
     * 每30分钟执行
     * @returns 
     */
  public everyThirtyMinutes() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '*/30');
  }

  /**
     * 每小时执行
     * @returns 
     */
  public hourly() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '*');
  }

  /**
     * 固定时间执行, [1, 5, 24]
     * @param offset 
     * @returns 
     */
  public hourlyAt(offset: number | number[]) {
    const _offset = Array.isArray(offset) ? offset.join(',') : `${offset}`;
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, _offset);
  }

  /**
     * 每2个小时执行
     * @returns 
     */
  public everyTwoHours() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '*/2');
  }

  /**
     * 每3个小时执行
     * @returns 
     */
  public everyThreeHours() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '*/3');
  }

  /**
     * 每4个小时执行
     * @returns 
     */
  public everyFourHours() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '*/4');
  }

  /**
     * 每6个小时执行
     * @returns 
     */
  public everySixHours() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '*/6');
  }

  /**
     * 每天执行
     * @returns 
     */
  public daily() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '0');
  }

  /**
     * 在每天的固定时间执行
     * Example:
     * dailyAt('13')
     * dailyAt('13:00')
     * dailyAt('13:00:01')
     * @param time 
     * @returns 
     */
  public dailyAt(time: string) {
    const segments = time.split(':');
    return this.spliceIntoPosition(3, segments[0])
      .spliceIntoPosition(2, segments.length > 1 ? segments[1] : '0')
      .spliceIntoPosition(1, segments.length > 2 ? segments[2] : '0');
  }

  /**
     * 在工作日执行
     * @returns 
     */
  public weekdays() {
    return this.spliceIntoPosition(6, '1-5');
  }

  /**
     * 在周末执行
     * @returns 
     */
  public weekends() {
    return this.spliceIntoPosition(6, '0,7');
  }

  /**
     * 在周一执行
     * @returns 
     */
  public mondays() {
    return this.spliceIntoPosition(6, '1');
  }

  /**
     * 在周二执行
     * @returns 
     */
  public tuesdays() {
    return this.spliceIntoPosition(6, '2');
  }

  /**
     * 在周三执行
     * @returns 
     */
  public wednesdays() {
    return this.spliceIntoPosition(6, '3');
  }

  /**
     * 在周四执行
     * @returns 
     */
  public thursdays() {
    return this.spliceIntoPosition(6, '4');
  }

  /**
     * 在周五执行
     * @returns 
     */
  public fridays() {
    return this.spliceIntoPosition(6, '5');
  }

  /**
     * 在周六执行
     * @returns 
     */
  public saturdays() {
    return this.spliceIntoPosition(6, '6');
  }

  /**
     * 在周日执行
     * @returns 
     */
  public sundays() {
    return this.spliceIntoPosition(6, '0');
  }

  /**
     * 每周执行
     * @returns 
     */
  public weekly() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '0')
      .spliceIntoPosition(6, '0');
  }

  /**
     * 在每周的具体天具体时间之行
     * @param dayOfWeek 
     * @param time 
     * @returns 
     */
  public weeklyOn(dayOfWeek: number | string, time = '0:0') {
    return this.dailyAt(time)
      .spliceIntoPosition(6, `${dayOfWeek}`);
  }

  /**
     * 在每月执行
     * @returns 
     */
  public monthly() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '0')
      .spliceIntoPosition(4, '1');
  }

  /**
     * 在每月的第几天具体时间执行
     * @param dayOfMonth 
     * @param time 
     * @returns 
     */
  public monthlyOn(dayOfMonth: string | number, time = '0:0') {
    return this.dailyAt(time)
      .spliceIntoPosition(4, `${dayOfMonth}`);
  }

  /**
     * 在每个季度执行
     * @returns 
     */
  public quarterly() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '0')
      .spliceIntoPosition(4, '1')
      .spliceIntoPosition(5, '1-12/3');
  }

  /**
     * 在每年的开始时间之行
     * @returns 
     */
  public yearly() {
    return this.spliceIntoPosition(1, '0')
      .spliceIntoPosition(2, '0')
      .spliceIntoPosition(3, '0')
      .spliceIntoPosition(4, '1')
      .spliceIntoPosition(5, '1');
  }

  /**
     * 在每年的具体月具体天具体时间之行
     * @param month 
     * @param dayOfMonth 
     * @param time 
     * @returns 
     */
  public yearlyOn(month: string | number = 1, dayOfMonth: string | number = 1, time = '0:0') {
    return this.dailyAt(time)
      .spliceIntoPosition(4, `${dayOfMonth}`)
      .spliceIntoPosition(5, `${month}`);
  }

  /**
     * 设置时区
     * @param timezone 
     * @returns 
     */
  public timezone(timezone: string) {
    this._timezone = timezone;
    return this;
  }

  /**
     * 获取时区
     * @returns 
     */
  public getTimezone() {
    return this._timezone;
  }

  /**
     * 获取 Corn 表达式
     * @returns 
     */
  public getExpression() {
    return this.expression;
  }

  /**
     * 在单个服务器运行
     */
  public runOnSingletonServer() {
    this._singletonServer = true;
    return this;
  }

  /**
     * 是否单例服务器运行
     * @returns 
     */
  public isRunOnSingletonServer() {
    return this._singletonServer;
  }

  /**
     * 根据指定位置拼接 corn 表达式
     * @param position 
     * @param value 
     * @returns 
     */
  protected spliceIntoPosition (position: number, value: string) {
    const segments = this.expression.split(' ');
    segments[position - 1] = value;
    return this.corn(segments.join(' '));
  }
}