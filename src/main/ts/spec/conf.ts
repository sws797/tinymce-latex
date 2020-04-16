/**
 * 全局配置
 */
export class Conf {

  /** 插件名称 */
  public name: string;

  /** 插件对话框标题 */
  public title: string;

  /** 插件公式录入框区域标识 */
  public textarea: string;

  /** 公式标识信息 */
  public latexId: string;

  /** 公式前缀 */
  public prefix: string;

  /** 公式后缀 */
  public suffix: string;

  /** 前缀长度 */
  public prefixLength: number;

  /** 后缀长度 */
  public suffixLength: number;

  /** 公式选择器 */
  public selector: string;

  /** 渲染区域标识 */
  public renderId: string;

  constructor(name: string, title: string, textarea: string, latexId: string, prefix: string, suffix: string, selector: string) {
    this.name = name;
    this.title = title;
    this.textarea = textarea;
    this.latexId = latexId;
    this.prefix = prefix;
    this.suffix = suffix;
    this.prefixLength = this.prefix.length;
    this.suffixLength = this.prefix.length;
    this.selector = selector;
  }
}
