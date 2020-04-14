import { document, HTMLElement, window } from '@ephox/dom-globals';
import { LatexRender } from './core/latex-render';
import { LatexConfig } from './core/latex-config';
import { MathJaxInit } from './core/math-jax-init';

declare const tinymce: any;

/**
 * 插件核心功能
 */
const setup = (editor) => {

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
    /** 公式渲染容器 */
    let container: HTMLElement;
    /** 传入元素 */
    if (target && target.getAttribute) {
      /** 获取元素的公式值 */
      const attribute = target.getAttribute('data-latex');
      /** 截取纯公式 */
      if (attribute.length >= 4) {
        latex = attribute.substr(2, attribute.length - 4);
      }
    }
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
          html: `<div id="${conf.renderIframeID}" style="font-size: 1.5rem; width: 100%;"></div>
                 <p style="text-align: center; font-size: 12px; color: #1677ff;">很抱歉, 受第三方开源库MathJax 3.0限制, TinyMCE Latex暂不支持公式换行</p>`
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
        LatexRender.renderInContainer(window, document, container, value);
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
    container = document.getElementById(conf.renderIframeID);
    /** 渲染 iframe 公式 */
    LatexRender.renderInContainer(window, document, container, latex);
  };

  /** 注册 Latex 按钮 */
  editor.ui.registry.addButton('tinymce-latex', {
    text: 'LaTex',
    onSetup: () => {
      /** 初始化配置 */
      conf = new LatexConfig(editor);
      /** 配置编辑器 iframe 里的 MathJax 配置 */
      MathJaxInit.conf(editor.dom.win, editor.dom.doc, conf);
      /** 配置主体 window 里的 MathJax 配置 */
      MathJaxInit.conf(window, document, conf);
    },
    onAction: () => {
      latexAction(null);
    }
  });
};

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};
