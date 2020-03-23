import { Document, document, HTMLElement, Window } from '@ephox/dom-globals';
import { LatexRender } from './core/latex-render';
import { LatexConfig } from './core/latex-config';
import { MathJaxInit } from './core/math-jax-init';

declare const tinymce: any;

/**
 * 插件核心功能
 */
const setup = (editor, url) => {

  /** 核心配置 */
  let conf;

  editor.on('GetContent', function (e) {
    /** 查询所有需要渲染的元素 */
    const div = document.createElement('div') as HTMLElement;
    div.innerHTML = e.content;
    const elements = div.querySelectorAll('.math-tex');
    /** 元素 -> latex */
    // @ts-ignore
    for (const element of elements) {
      /** 移除子元素 */
      const children = element.querySelectorAll('span');
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < children.length; j++) {
        children[j].remove();
      }
      /** 移除属性 */
      const latex = element.getAttribute('data-latex');
      element.removeAttribute('contenteditable');
      element.removeAttribute('style');
      element.removeAttribute('data-latex');
      element.innerHTML = latex;
    }
    /** 返回纯 latex */
    e.content = div.innerHTML;
  });

  /** 监听 before-set-content 事件 */
  editor.on('BeforeSetContent', function (e) {
    /** 查询所有需要渲染的元素 */
    const div = document.createElement('div') as HTMLElement;
    div.innerHTML = e.content;
    const elements = div.querySelectorAll('.math-tex');
    /** 渲染元素 */
    // @ts-ignore
    for (const element of elements) {
      renderElement(element);
    }
    /** 渲染后置回 */
    e.content = div.innerHTML;
  });

  /** 监听 set-content 事件 */
  editor.on('SetContent', () => {
    /** 渲染公式 */
    LatexRender.render(editor.getDoc().defaultView.MathJax);
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
    element.setAttribute('contenteditable', false);
    element.setAttribute('data-latex', value);

    const math = editor.dom.create('span');
    math.innerHTML = value;
    math.classList.add('math-tex-original');
    element.appendChild(math);
  };

  /**
   * 从 api 对象中获取输入值
   * @param api 编辑器对象
   */
  const getValue = (api) => {
    return api.getData().input.trim();
  };

  /**
   * latex 插件的按钮点击响应方法
   * @param target 当前编辑的目标元素
   */
  const latexAction = (target) => {
    /** 当前公式数据 */
    let latex: string = '';
    /** 传入元素 */
    if (target) {
      /** 获取元素的公式值 */
      const attribute = target.getAttribute('data-latex');
      /** 截取纯公式 */
      if (attribute.length >= 4) {
        latex = attribute.substr(2, attribute.length - 4);
      }
    }
    /** 弹出框 Window 对象 */
    let iframeWindow: Window;
    /** 弹出框文档对象 */
    let iframeDocument: Document;
    // noinspection TypeScriptValidateJSTypes
    /** 点击时，弹出选择页面 */
    editor.windowManager.open({
      /** 弹出框标题 */
      title: 'Latex 公式录入',
      /** 弹出框主体 */
      body: {
        type: 'panel',
        items: [{
          type: 'textarea',
          name: 'input'
        }, {
          type: 'htmlpanel',
          name: 'render',
          html: `<iframe id="${conf.renderIframeID}" style="width: 100%"></iframe>`
        }]
      },
      /** 底部按钮 */
      buttons: [
        {
          type: 'submit',
          text: '保存'
        }
      ],
      /** 弹出框尺寸 */
      size: 'large',
      onChange: (api) => {
        /** 获取输入值 */
        const value = getValue(api);
        /** 渲染 iframe 公式 */
        LatexRender.renderInIframe(iframeWindow, iframeDocument, value);
      },
      onSubmit: (api) => {
        /** 获取输入值 */
        const value = getValue(api);
        /** 构造元素 */
        const element = editor.getDoc().createElement('span');
        /** 渲染元素 */
        renderElementWithLatex(element, LatexRender.mathify(value));
        /** 添加到编辑器 */
        editor.insertContent(element.outerHTML);
        /** 关闭 api */
        api.close();
      },
      initialData: {input: latex}
    });

    /** 获取渲染容器 */
    const container = document.getElementById(conf.renderIframeID);
    /** 获取渲染 window */
    // @ts-ignore
    iframeWindow = container.contentWindow;
    /** 获取渲染 document */
    // @ts-ignore
    iframeDocument = container.contentDocument;
    /** 初始化 MathJax 配置 */
    MathJaxInit.conf(iframeWindow, iframeDocument, conf);
    /** 渲染 iframe 公式 */
    LatexRender.renderInIframe(iframeWindow, iframeDocument, latex);
  };

  /** 注册 Latex 按钮 */
  editor.ui.registry.addButton('tinymce-latex', {
    text: 'LaTex',
    onSetup: () => {
      /** 初始化配置 */
      conf = new LatexConfig(editor);
      /** 初始化 MathJax 配置 */
      MathJaxInit.conf(editor.dom.win, editor.dom.doc, conf);
    },
    onAction: latexAction
  });
};

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};
