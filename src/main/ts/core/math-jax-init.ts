import { Document, Window } from '@ephox/dom-globals';
import { LatexConfig } from './latex-config';

/**
 * MathJax 初始化
 */
export class MathJaxInit {

  /**
   * MathJax 初始化配置方法
   * @param window Window对象
   * @param document 文档对象
   * @param conf 公式配置对象
   */
  public static conf(window: Window, document: Document, conf: LatexConfig): void {
    this.initConf(window);
    this.importJavaScript(document, conf.scripts);
  }

  /**
   * 初始化 MathJax 配置
   * @param window Window对象
   */
  private static initConf(window: Window): void {
    // @ts-ignore
    window.MathJax = {
      options: {
        processHtmlClass: 'math-tex-original',
        ignoreHtmlClass: '.*'
      }
    };
  }

  /**
   * 引入外部 JavaScript 文件
   * @param document 文档对象
   * @param scripts JavaScript 文件地址数组
   */
  private static importJavaScript(document: Document, scripts: Array<string>) {
    /** 引入相关第三方库 */
    scripts.forEach((value: string) => {
      /** 创建 script 节点 */
      const node = document.createElement('script');
      /** 配置 script 节点 */
      node.src = value;
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      /** 添加到 head 中 */
      document.head.appendChild(node);
    });
  }
}
