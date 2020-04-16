/**
 * 公式配置
 */
export class LatexConfig {

  /** 公式渲染栏 id */
  public renderIframeID: string;

  /** 外部 JavaScript 文件地址列表 */
  public scripts: Array<string>;

  constructor(editor: any) {
    /** 获取公式渲染栏 id */
    this.renderIframeID = editor.dom.uniqueId();
  }
}
