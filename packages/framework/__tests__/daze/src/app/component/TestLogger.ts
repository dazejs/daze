/**
 * Test for Logger
 */
export class TestLogger {
  private readonly props: any;

  constructor(props: any) {
    this.props = props;
  }

  log(l: any): string {
    return `TestLogger(${this.props}) => ${l}`;
  }

}

export class TestLogger2 {
  private readonly props: any;

  constructor(props: any) {
    this.props = props;
  }

  log(l: any): string {
    return `TestLogger2(${this.props}) => ${l}`;
  }

}