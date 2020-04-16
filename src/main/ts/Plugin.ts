import { document, HTMLIFrameElement, window } from '@ephox/dom-globals';
import { LatexRender } from './core/latex-render';

declare const tinymce: any;

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};

const conf = {
  /** 插件名称 */
  name: 'LaTex',
  /** 插件标题 */
  title: 'Latex 公式录入',
  /** 插件区域值标识 */
  textarea: 'latex',
  /** 公式标识信息 */
  latexId: 'data-latex',
  /** 公式前缀 */
  prefix: '\(',
  /** 公式后缀 */
  suffix: '\)',
  /** 渲染区域标识 */
  renderId: ''
};

/**
 * 插件核心功能
 */
const setup = (editor) => {

  /** 注册 Latex 按钮 */
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
    /** 当前公式内容 */
    let latex: string = '';
    /** 公式渲染容器 */
    let container: HTMLIFrameElement;

    // todo: 2020.04.16
    /** 传入元素 */
    if (target) {
      /** 获取元素的公式值 */
      const attribute = target.getAttribute(conf.latexId);
      /** 截取纯公式 */
      if (attribute.length >= 4) {
        latex = attribute.substr(2, attribute.length - 4);
      }
    }

    openLatexDialog('123213', (api) => {
      /** 获取输入值 */
      const value = getValue(api);
      /** 渲染 iframe 公式 */
      LatexRender.renderInContainer(window, document, container, value);
    }, (api) => {
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
    });

    /** 获取渲染容器 */
    container = document.getElementById(conf.renderId);
    /** 渲染 iframe 公式 */
    LatexRender.renderInContainer(window, document, container, latex);
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
          html: `<iframe id="${conf.renderId}" style="width: 100%;"></iframe>
                 <p style="text-align: center; font-size: 12px; color: #1677ff;">很抱歉, 受第三方开源库MathJax 3.0限制, TinyMCE Latex暂不支持公式换行</p>`
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
  editor.on('SetContent', () => {
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
   * 从 api 对象中获取输入值
   * @param api 编辑器对象
   */
  const getValue = (api) => {
    return api.getData().input.trim();
  };
};


