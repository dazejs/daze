

export interface PaginatorOption {
  currentPageKey?: string;
  perPageKey?: string;
  totalkey?: string;
  dataKey?: string;
}

export class Paginator {
  /**
   * 当前页属性名 - 静态全局属性
   */
  static currentPageKey = 'current_page';

  /**
   * 每页长度属性名 - 静态全局属性
   */
  static perPageKey = 'per_page';

  /**
   * 总数属性名 - 静态全局属性
   */
  static totalkey = 'total';

  /**
   * 数据属性名
   */
  static dataKey = 'data';

  /**
   * 每页长度
   */
  private _perPage: number;

  /**
   * 当前页码
   */
  private _currentPage: number;

  /**
   * 总数
   */
  private _total: number;

  /**
   * 数据
   */
  private _items: any[];

  /**
   * 配置项
   */
  private _option?: PaginatorOption;

  constructor(
    items: any[],
    total: number,
    currentPage: number,
    perPage: number,
    option?: PaginatorOption
  ) {
    this._items = items;
    this._perPage = perPage;
    this._currentPage = currentPage;
    this._total = total;
    this._option = option;
  }

  /**
   * 全局配置
   * @param option 
   */
  static configure(option: PaginatorOption) {
    if (option.currentPageKey) this.currentPageKey = option.currentPageKey;
    if (option.perPageKey) this.perPageKey = option.perPageKey;
    if (option.totalkey) this.totalkey = option.totalkey;
  }

  /**
   * 获取属性名
   */
  getDataKey() {
    return this._option?.dataKey ?? Paginator.dataKey;
  }

  /**
   * 获取当前页属性名
   */
  getCurrentPageKey() {
    return this._option?.currentPageKey ?? Paginator.currentPageKey;
  }

  /**
   * 获取总数属性名
   */
  getTotalKey() {
    return this._option?.totalkey ?? Paginator.totalkey;
  }

  /**
   * 获取每页大小属性名
   */
  getPerPageKey() {
    return this._option?.perPageKey ?? Paginator.perPageKey;
  }

  /**
   * 获取当前页
   */
  getCurrentPage() {
    return Number(this._currentPage);
  }

  /**
   * 获取每页大小
   */
  getPerPage() {
    return Number(this._perPage);
  }

  /**
   * 获取总数
   */
  getTotal() {
    return Number(this._total);
  }

  /**
   * 获取数据
   */
  getData() {
    return this._items;
  }

  /**
   * 格式化
   */
  toJSON() {
    return {
      [this.getCurrentPageKey()]: this.getCurrentPage(),
      [this.getPerPageKey()]: this.getPerPage(),
      [this.getTotalKey()]: this.getTotal(),
      [this.getDataKey()]: this.getData()
    };
  }
}