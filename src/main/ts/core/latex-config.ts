import { LatexSpec } from '../spec/latex.spec';

/**
 * 公式配置
 */
export class LatexConfig {

  /** 公式渲染栏 id */
  public renderIframeID: string;

  /** 用户自定义配置 */
  public conf: LatexSpec;

  /** 外部 JavaScript 文件地址列表 */
  public scripts: Array<string>;

  constructor(editor: any) {
    /** 获取公式渲染栏 id */
    this.renderIframeID = editor.dom.uniqueId();
    /** 获取用户自定义配置 */
    this.conf = editor.settings.latex;
    /** 配置第三方 JavaScript 脚本 */
    this.scripts = new Array<string>();
    this.scripts.push(this.conf.mathJax.lib);
  }
}
