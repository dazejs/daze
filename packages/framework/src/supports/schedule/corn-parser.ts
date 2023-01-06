

/**
 * CORN 解析器
 */
export class CornParser {

  /**
     * 月份
     */
  public static MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august','september', 'october', 'november', 'december'];
  /**
     * 月份缩写
     */
  public static SHORT_MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  /**
     * 星期
     */
  public static WEEKS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  /**
     * 星期缩写
     */
  public static SHORT_WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
  /**
     * 将文本月份转换为数字月份
     * @param expression
     * @returns 
     */
  public convertMonthName(expression: string) {
    let _expression = expression;
    for (const [index, month] of CornParser.MONTHS.entries()) {
      _expression = _expression.replace(new RegExp(month, 'gi'), `${parseInt(`${index}`, 10) + 1}`);
    }
    for (const [index, month] of CornParser.SHORT_MONTHS.entries()) {
      _expression = _expression.replace(new RegExp(month, 'gi'), `${parseInt(`${index}`, 10) + 1}`);
    }
    return _expression;
  }

  /**
     * 将文本的星期转换为数字的星期
     * @param expression
     * @returns 
     */
  public convertWeekName(expression: string) {
    let _expression = expression.replace('7', '0');
    for (const [index, week] of CornParser.WEEKS.entries()) {
      _expression = _expression.replace(new RegExp(week, 'gi'), `${parseInt(`${index}`, 10)}`);
    }
    for (const [index, week] of CornParser.SHORT_WEEKS.entries()) {
      _expression = _expression.replace(new RegExp(week, 'gi'), `${parseInt(`${index}`, 10)}`);
    }
    return _expression;
  }

  /**
     * 将表达式中的星号（*） 转换为具体的范围
     * @param expressions
     * @returns 
     */
  public convertAsterisks(expressions: string[]) {
    if (~expressions[0].indexOf('*')) {
      expressions[0] = expressions[0].replace('*', '0-59');
    }
    if (~expressions[1].indexOf('*')) {
      expressions[1] = expressions[1].replace('*', '0-59');
    }
    if (~expressions[2].indexOf('*')) {
      expressions[2] = expressions[2].replace('*', '0-23');
    }
    if (~expressions[3].indexOf('*')) {
      expressions[3] = expressions[3].replace('*', '1-31');
    }
    if (~expressions[4].indexOf('*')) {
      expressions[4] = expressions[4].replace('*', '1-12');
    }
    if (~expressions[5].indexOf('*')) {
      expressions[5] = expressions[5].replace('*', '0-6');
    }
    return expressions;
  }

  /**
     * 转换单个时间范围表达式
     * @param expression
     * @returns 
     */
  public convertRange(expression: string) {
    const rangeRegEx = /(\d+)-(\d+)/;
    let match = rangeRegEx.exec(expression);
    while(match !== null && match.length > 0){
      const numbers = [];
      let last = parseInt(match[2]);
      let first = parseInt(match[1]);
      if (first > last){
        last = parseInt(match[1]);
        first = parseInt(match[2]);
      }
      for (let i = first; i <= last; i++) {
        numbers.push(i);
      }
      expression = expression.replace(new RegExp(match[0], 'i'), numbers.join());
      match = rangeRegEx.exec(expression);
    }
    return expression;
  }

  /**
     * 转换所有时间范围表达式
     * @param expressions 
     * @returns 
     */
  public convertRanges(expressions: string[]) {
    return expressions.map(expression => this.convertRange(expression));
  }

  /**
     * 转换 Steps
     * @param expressions
     */
  public convertSteps(expressions: string[]) {
    const stepValuePattern = /^(.+)\/(\w+)$/;
    for (const [index, expression] of expressions.entries()) {
      const match = stepValuePattern.exec(expression);
      const isStepValue = match !== null && match.length > 0;
      if (isStepValue) {
        const baseDivider = match[2];
        if (isNaN(+baseDivider)){
          throw baseDivider + ' is not a valid step value';
        }
        const values = match[1].split(',');
        const stepValues = [];
        const divider = parseInt(baseDivider, 10);
        for (const value of values) {
          const _value = parseInt(value, 10);
          if(_value % divider === 0){
            stepValues.push(value);
          }
        }
        expressions[index] = stepValues.join(',');
      }
    }
    return expressions;
  }

  /**
     * 表达式解释器
     */
  public interprete(expression: string) {
    let _expressions = expression.replace(/\s{2,}/g, ' ').trim().split(' ');
    // 如果长度是 5 的话 添加秒数
    if (_expressions.length === 5) {
      _expressions = ['0'].concat(_expressions);
    }
    _expressions[4] = this.convertMonthName(_expressions[4]);
    _expressions[5] = this.convertWeekName(_expressions[5]);
    _expressions = this.convertAsterisks(_expressions);
    _expressions = this.convertRanges(_expressions);
    _expressions = this.convertSteps(_expressions);
    const numberExpressions = _expressions.map(exp => exp.split(',').map(number => parseInt(number)));
    return numberExpressions.join(' ');
  }
}