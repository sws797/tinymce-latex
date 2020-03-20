import { LatexSpec } from './spec/latex.spec';
import { Document, document, Window, window } from '@ephox/dom-globals';

declare const tinymce: any;

/**
 * 插件核心功能
 */
const setup = (editor, url) => {

  /** latex 公式 */
  let latex = '';

  /** 渲染项 id */
  let renderId = '';

  /** 插件配置 */
  let config: LatexSpec = new LatexSpec();

  /** 外部 JavaScript 文件地址列表 */
  const arr: Array<string> = new Array<string>();

  /**
   * 初始化 MathJax 配置
   */
  const initMathJaxConf = (win: Window) => {
    // @ts-ignore
    win.MathJax = {
      options: {
        processHtmlClass: 'math-tex-original',
        ignoreHtmlClass: '.*'
      }
    };
  };

  /**
   * 引入外部 JavaScript 文件
   * @param doc 文档对象
   * @param array JavaScript 文件地址数组
   */
  const importJavaScript = (doc: Document, array: Array<string>) => {
    /** 引入相关第三方库 */
    array.forEach((value: string) => {
      /** 创建 script 节点 */
      const node = doc.createElement('script');
      /** 配置 script 节点 */
      node.id = editor.dom.uniqueId();
      node.src = value;
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      /** 添加到 head 中 */
      doc.head.appendChild(node);
    });
  };

  /** 注册 Latex 按钮 */
  editor.ui.registry.addButton('tinymce-latex', {
    text: 'LaTex',
    onSetup: () => {
      /** 获取渲染标签 id */
      renderId = editor.dom.uniqueId();
      /** 获取用户配置 */
      config = editor.settings.latex;
      /** 添加配置 */
      arr.push(config.mathJax.lib);
      /** 初始化 MathJax 配置 */
      initMathJaxConf(editor.dom.win);
      /** 当前文档引入外部 JavaScript 库 */
      importJavaScript(editor.dom.doc, arr);
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
            html: `<iframe id="${renderId}"></iframe>`
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
          if (value !== latex) {
            /** 渲染公式 */
            render(value);
            /** 储存公式 */
            latex = value;
          }
        },
        onSubmit: (api) => {
          console.log('submited');
        }
      });

      /** 获取渲染容器 */
      const container = document.getElementById(renderId);
      /** 获取渲染 document */
      // @ts-ignore
      const renderDocument = container.contentDocument;
      /** 获取渲染 window */
      // @ts-ignore
      const renderWindow = container.contentWindow;
      /** 初始化 MathJax 配置 */
      initMathJaxConf(window);
      initMathJaxConf(renderWindow);
      /** 渲染文档引入外部 JavaScript 库 */
      importJavaScript(renderDocument, arr);

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
        holder.innerHTML = mathify(value);
        /** 渲染 */
        renderWindow.MathJax.typeset();
      };

      /**
       * 将 latex 公式数学化
       * @param value latex 公式
       */
      const mathify = (value: string) => {
        return `$$${value}$$`;
      };
    }
  });
};

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};
