import { document } from '@ephox/dom-globals';
import { LatexRender } from './core/latex-render';
import { LatexConfig } from './core/latex-config';
import { MathJaxInit } from './core/math-jax-init';

declare const tinymce: any;

/**
 * 插件核心功能
 */
const setup = (editor, url) => {

  let conf;

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

  // add dummy tag on set content
  editor.on('BeforeSetContent', function (e) {
    const div = editor.dom.create('div');
    div.innerHTML = e.content;
    const elements = div.querySelectorAll('.math-tex');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0 ; i < elements.length; i++) {
      renderElement(elements[i]);
    }
    e.content = div.innerHTML;
  });

  /** 监听 set-content 事件 */
  editor.on('SetContent', () => {
    /** 渲染公式 */
    LatexRender.render(editor.getDoc().defaultView.MathJax);
  });

  /** 注册 Latex 按钮 */
  editor.ui.registry.addButton('tinymce-latex', {
    text: 'LaTex',
    onSetup: () => {
      /** 初始化配置 */
      conf = new LatexConfig(editor);
      /** 初始化 MathJax 配置 */
      MathJaxInit.conf(editor.dom.win, editor.dom.doc, conf);
    },
    onAction: () => {
      // noinspection TypeScriptValidateJSTypes
      /** 点击时，弹出选择页面 */
      editor.windowManager.open({
        title: 'Latex 公式录入',
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
        buttons: [
          {
            type: 'submit',
            text: 'OK'
          }
        ],
        size: 'large',
        onChange: (api) => {
          /** 获取输入值 */
          const value = api.getData().input.trim();
          /** 如果当前公式有改动 */
          if (value !== conf.latex) {
            /** 渲染公式 */
            render(value);
            /** 储存公式 */
            conf.latex = value;
          }
        },
        onSubmit: (api) => {
          /** 获取输入值 */
          const value = api.getData().input.trim();
          /** 构造元素 */
          const element = editor.getDoc().createElement('span');
          /** 渲染元素 */
          renderElementWithLatex(element, LatexRender.mathify(value));
          /** 添加到编辑器 */
          editor.insertContent(element.outerHTML);
          /** 关闭 api */
          api.close();
        }
      });

      /** 获取渲染容器 */
      const container = document.getElementById(conf.renderIframeID);
      /** 获取渲染 document */
      // @ts-ignore
      const renderDocument = container.contentDocument;
      /** 获取渲染 window */
      // @ts-ignore
      const renderWindow = container.contentWindow;
      /** 初始化 MathJax 配置 */
      MathJaxInit.conf(renderWindow, renderDocument, conf);

      /**
       * 渲染公式
       * @param value latex 公式
       */
      const render = (value) => {
        /** 获取公式持有者 */
        let holder = renderDocument.body.querySelector('div');
        /** 不存在则创建 */
        if (!holder) {
          holder = renderDocument.createElement('div');
          holder.classList.add('math-tex-original');
          renderDocument.body.appendChild(holder);
        }
        /** 置入公式 */
        holder.innerHTML = LatexRender.mathify(value);
        /** 渲染 */
        renderWindow.MathJax.typeset();
      };
    }
  });
};

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};
