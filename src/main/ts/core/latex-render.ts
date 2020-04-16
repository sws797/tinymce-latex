import { Document, HTMLElement, Window } from '@ephox/dom-globals';

/**
 * 公式渲染类
 */
export class LatexRender {



  /**
   * 渲染公式
   * @param mathJax 渲染器
   */
  public static render(mathJax: any): void {
    if (mathJax && mathJax.startup) {
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

  /**
   * 公式栏内渲染公式
   * @param window Window对象
   * @param document 文档对象
   * @param container 公式容器
   * @param value 公式
   */
  public static renderInContainer(window: Window, document: Document, container: HTMLElement, value: string) {
    /** 获取公式持有者 */
    let holder = container.querySelector('span');
    /** 不存在则创建 */
    if (!holder) {
      holder = document.createElement('span');
      holder.classList.add('math-tex-original');
      container.appendChild(holder);
    }
    /** 置入公式 */
    holder.innerHTML = this.mathify(value);
    /** 渲染 */
    // @ts-ignore
    this.render(window.MathJax);
  }
}
