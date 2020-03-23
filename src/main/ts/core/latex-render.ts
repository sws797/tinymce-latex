/**
 * 公式渲染类
 */
export class LatexRender {

  /**
   * 渲染公式
   * @param mathJax 渲染器
   */
  public static render(mathJax: any): void {
    if (mathJax) {
      mathJax.startup.getComponents();
      mathJax.typeset();
    }
  }

  /**
   * 将 latex 公式数学化
   * @param latex 公式
   */
  public static mathify(latex: string): string {
    return `$$${latex}$$`;
  }
}
