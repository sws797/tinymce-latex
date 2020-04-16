import { window } from '@ephox/dom-globals';

/**
 * MathJax 对象持有者
 */
export class MathJaxHolder {

  public static getMathJax(): any {
    if (this.ready) {
      return this.mathJax;
    }
    if (!window.MathJax) {
      throw 'please check MathJax!';
    }
    this.mathJax = window.MathJax;
    this.ready = true;
    return this.mathJax;
  }

  private static ready: boolean;

  private static mathJax: any;
}
