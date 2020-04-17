import { Document, document, HTMLElement, HTMLIFrameElement } from '@ephox/dom-globals';
import { Conf } from './spec/conf';
import { MathJaxHolder } from './core/math-jax-holder';

declare const tinymce: any;

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};

/**
 * 插件核心配置
 */
const conf: Conf = new Conf(
  'LaTex',
  'Latex 公式录入',
  'latex',
  'data-latex',
  '\(', '\)',
  'math-tex'
);

/**
 * 插件核心功能
 */
const setup = (editor) => {

  /**
   * 注册 Latex 按钮
   */
  editor.ui.registry.addButton('tinymce-latex', {
    text: conf.name,
    onSetup: () => {
      conf.renderId = editor.dom.uniqueId();
    },
    onAction: () => {
      onActionHandler(null);
    }
  });

  /**
   * latex 插件的按钮点击响应方法
   * @param target 当前编辑的目标元素
   */
  const onActionHandler = (target) => {
    let latex: string = '';
    let container: HTMLIFrameElement;

    /** 传入元素，截取公式 */
    if (target) {
      const attribute = target.getAttribute(conf.latexId);
      if (attribute.length >= (conf.prefixLength + conf.suffixLength)) {
        latex = attribute.substr(conf.prefixLength, attribute.length - (conf.prefixLength + conf.suffixLength));
      }
    }

    /** 打开公式会话窗口 */
    openLatexDialog(latex, (api) => {
      /** 获取公式并渲染 */
      const value = getLatexValue(api);
      renderLatexInNewDocument(container.contentDocument, value);
    }, (api) => {
      /** 提交公式 */
      const value = getLatexValue(api);
      if (!target) {
        target = document.createElement('span');
      }
      target.classList.add(conf.clazz);
      target.innerHTML = value;
      target.setAttribute(conf.latexId, value);
      editor.insertContent(target.outerHTML);
      api.close();
    });

    /** 获取容器并渲染 */
    container = document.getElementById(conf.renderId) as HTMLIFrameElement;
    renderLatexInNewDocument(container.contentDocument, latex);
  };

  /**
   * 打开公式录入框
   * @param latex           latex 公式
   * @param onChangeHandler 公式变动处理器
   * @param onSubmitHandler 公式提交处理器
   */
  const openLatexDialog = (latex: string,
                           onChangeHandler: (api) => void,
                           onSubmitHandler: (api) => void) => {
    /** 配置初始化数据 */
    const initial = {};
    initial[conf.textarea] = latex;
    /** 点击时，弹出选择页面 */
    editor.windowManager.open({
      title: conf.title,
      body: {
        type: 'panel',
        items: [{
          type: 'textarea',
          name: 'latex'
        }, {
          type: 'htmlpanel',
          name: 'render',
          html: `<iframe id="${conf.renderId}" style="width: 100%;"></iframe>`
        }]
      },
      buttons: [{
        type: 'submit',
        text: '保存'
      }],
      size: 'large',
      onChange: onChangeHandler,
      onSubmit: onSubmitHandler,
      initialData: initial
    });
  };

  /**
   * 在新文档中渲染公式
   * @param doc   文档对象
   * @param latex 公式
   */
  const renderLatexInNewDocument = (doc: Document, latex: string) => {
    renderLatexInHTMLElement(doc.body, latex);
  };

  /**
   * 渲染 HTML 元素公式
   * @param el 元素
   */
  const renderHTMLElement = (el: HTMLElement) => {
    renderLatexInHTMLElement(el, el.getAttribute(conf.latexId));
  };

  /**
   * 在 HTML 元素中渲染公式
   * @param el    元素
   * @param latex 公式
   */
  const renderLatexInHTMLElement = (el: HTMLElement, latex: string) => {
    /** 获取公式渲染结果 */
    const mathJax = MathJaxHolder.getMathJax();
    const options = mathJax.getMetricsFor(el, true);
    const node = mathJax.tex2svg(latex, options);
    let result = node.querySelector('svg');

    /** 错误处理 */
    const error = node.querySelector('merror');
    if (error) {
      result = document.createElement('strong');
      result.style.color = '#dc3545';
      result.innerHTML = '当前公式格式有误: ' + error.innerHTML;
    }

    /** 追加 */
    el.innerHTML = '';
    el.appendChild(result);
  };

  editor.on('GetContent', function (e) {
    // /** 查询所有需要渲染的元素 */
    // const div = document.createElement('div') as HTMLElement;
    // div.innerHTML = e.content;
    // const elements = div.querySelectorAll('.math-tex');
    // /** 元素 -> latex */
    // // @ts-ignore
    // for (const element of elements) {
    //   /** 移除子元素 */
    //   const children = element.querySelectorAll('span');
    //   // tslint:disable-next-line:prefer-for-of
    //   for (let j = 0; j < children.length; j++) {
    //     children[j].remove();
    //   }
    //   /** 移除属性 */
    //   const latex = element.getAttribute('data-latex');
    //   element.removeAttribute('contenteditable');
    //   element.removeAttribute('style');
    //   element.removeAttribute('data-latex');
    //   element.innerHTML = latex;
    // }
    // /** 返回纯 latex */
    // e.content = div.innerHTML;
  });

  /** 监听 before-set-content 事件 */
  editor.on('BeforeSetContent', function (e) {
    console.log('before set content');
    console.log(e);
    // /** 查询所有需要渲染的元素 */
    // const div = document.createElement('div') as HTMLElement;
    // div.innerHTML = e.content;
    // const elements = div.querySelectorAll('.math-tex');
    // /** 渲染元素 */
    // // @ts-ignore
    // for (const element of elements) {
    //   renderElement(element);
    // }
    // /** 渲染后置回 */
    // e.content = div.innerHTML;
  });

  /** 监听 set-content 事件 */
  editor.on('SetContent', (e) => {
    console.log('set content');
    console.log(e);

    // const div = document.createElement('div') as HTMLElement;
    // div.innerHTML = e.content;
    // const elements = div.querySelectorAll(conf.selector);
    // for (const element of elements) {
    //   renderHTMLElement(element);
    // }
    // console.log(elements);
    // console.log(div);
    // e.content = div.innerHTML;
    // editor.insertContent(div.innerHTML);
    // /** 渲染公式 */
    // LatexRender.render(editor.getDoc().defaultView.MathJax);
  });

  /** 监听点击事件 */
  editor.on('click', (e) => {
    /** 如果点击了 math-tex 的元素 */
    const container = e.target.closest('.math-tex');
    /** 弹出编辑框 */
    if (container) {
      latexAction(container);
    }
  });

  const renderElement = (element) => {
    const value = element.getAttribute('data-latex') || element.innerHTML;
    renderElementWithLatex(element, value);
  };

  /**
   * 渲染元素
   * @param element 元素
   * @param value 公式
   */
  const renderElementWithLatex = (element, value) => {
    element.classList.add('math-tex');
    element.innerHTML = '';
    element.style.cursor = 'pointer';
    element.style.display = 'inline-block';
    element.style.marginLeft = '5px';
    element.style.marginRight = '5px';
    element.setAttribute('contenteditable', false);
    element.setAttribute('data-latex', value);

    const math = editor.dom.create('span');
    math.innerHTML = value;
    math.classList.add('math-tex-original');
    element.appendChild(math);
  };

  /**
   * 获取当前输入的公式值
   * @param api 接口对象
   */
  const getLatexValue = (api) => {
    const data = api.getData();
    return data[conf.textarea].trim();
  };

  /**
   * 将公式变更为规范化格式
   * @param latex 公式
   */
  const normalize = (latex: string) => {
    return `${conf.prefix}${latex}${conf.suffix}`;
  };
};
