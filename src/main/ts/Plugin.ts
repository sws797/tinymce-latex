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
  'LaTex 公式录入',
  'latex',
  'data-latex',
  '\\\(',
  '\\\)',
  'math-tex'
);

/**
 * 插件核心功能
 */
const setup = (editor) => {

  /**
   * 添加 latex 图标
   */
  editor.ui.registry.addIcon('latex', '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">\n' +
    '  <path d="M941.62488889 582.48760889c-21.26279111 0-26.2144-2.03889778-27.37948444-2.91271111-6.11669333-6.40796445-12.52465778-16.01991111-20.38897778-27.67075556l-1.16508445-1.45635555c-7.86432-11.35957333-16.31118222-25.92312889-25.34058667-41.06922667-8.73813333-15.14609778-18.93262222-32.03982222-29.70965333-48.64227555 20.68024889-30.00092445 30.00092445-47.47719111 35.53507556-58.25422223 2.33016889-4.36906667 4.07779555-7.57304889 5.24288-9.32067555 16.01991111-20.38897778 20.68024889-23.01041778 48.05973333-26.2144l6.40796444-0.87381334-0.2912711-24.17550222h-97.57582223v25.92312889h7.28177778c7.86432-0.29127111 10.77703111 1.45635555 11.94211555 2.62144 0.58254222 0.58254222 1.45635555 2.03889778 1.45635556 5.53415111 0 6.99050667-13.68974222 26.79694222-27.08821333 45.72956444-2.62144 3.78652445-5.53415111 7.86432-8.44686223 12.23338667-14.56355555-21.26279111-24.46677333-37.57397333-36.70016-58.54549333l-0.2912711-0.29127111c-1.74762667-2.91271111-2.03889778-4.95160889-2.03889778-5.53415111 0.58254222-1.16508445 2.03889778-2.03889778 16.01991111-2.33016889l6.99050667-0.29127111v-24.46677334h-108.35285334v24.75804445h7.28177778c5.82542222 0 18.05880889 0.29127111 23.59296 1.74762667 4.36906667 1.45635555 9.02940445 8.44686222 15.72864 19.22389333 2.03889778 3.20398222 4.07779555 6.40796445 6.69923556 10.19448889l0.2912711 0.29127111c4.36906667 5.82542222 11.65084445 18.05880889 20.09770667 32.62236444 7.86432 13.39847111 16.60245333 28.25329778 26.50567111 43.39939556-24.46677333 37.28270222-36.99143111 57.38040889-43.98193778 68.44871111-5.24288 8.15559111-7.28177778 11.65084445-8.73813333 13.39847111-7.28177778 9.61194667-14.56355555 17.47626667-18.05880889 19.80643555-4.95160889 3.49525333-15.43736889 5.53415111-28.83584 5.82542223h-7.28177778v24.75804444h11.94211556c-1.16508445 3.49525333-2.03889778 7.57304889-3.20398222 11.65084445-4.07779555 15.72864-8.44686222 33.78744889-20.68024889 46.31210666l-0.29127111 0.29127112c-9.61194667 11.94211555-32.33109333 12.52465778-71.65269334 12.52465777-12.81592889 0-22.13660445 0-25.63185777-2.91271111-3.20398222-2.62144-4.36906667-10.77703111-4.36906667-27.08821333V577.536h25.34058667c17.47626667 0 21.84533333 2.91271111 23.88423111 5.82542222 3.20398222 4.66033778 3.78652445 14.56355555 4.36906666 28.54456889l0.58254223 9.02940444h23.01041777l0.29127112-112.72192h-22.42787556l-0.29127111 6.99050667c0 2.62144-0.29127111 5.24288-0.29127111 7.57304889-0.58254222 21.26279111-0.58254222 29.12711111-28.83584 29.12711111h-25.34058667V462.48391111h62.04074667c34.95253333 0 49.22481778 17.18499555 52.72007111 63.78837334l0.58254222 6.69923555h24.75804445l-0.58254222-7.86432c-0.87381333-11.94211555-3.20398222-27.96202667-5.53415112-43.69066667-2.33016889-15.14609778-4.36906667-29.41838222-4.36906666-35.82634666v-7.28177778H552.77795555l-7.86432-116.50844444H273.74023111l-6.69923556 116.79971555h22.13660445l0.58254222-6.69923555c1.16508445-16.60245333 6.69923555-56.79786667 10.19448889-62.33201778 4.07779555-6.40796445 8.73813333-10.48576 14.27228444-12.52465778 3.20398222-1.16508445 9.90321778-2.62144 24.46677334-2.62144h42.52558222c1.74762667 0 3.20398222 1.74762667 3.20398222 3.78652444v208.84138667c0 17.76753778-1.74762667 33.78744889-3.20398222 37.28270222-4.07779555 3.78652445-27.67075555 7.86432-40.77795556 7.86432h-16.89372444v26.79694223h173.59758222v-26.79694223h-16.60245333c-12.23338667 0-34.36999111-3.20398222-38.73905778-6.40796444-1.45635555-3.49525333-3.78652445-18.64135111-3.78652444-38.73905778v-209.7152c0-1.45635555 1.16508445-2.91271111 2.33016889-2.91271111h43.98193778c9.90321778 0 17.76753778 1.74762667 23.59296 4.95160889 5.53415111 3.20398222 10.19448889 8.15559111 13.68974222 14.85482667 1.74762667 4.36906667 6.69923555 36.99143111 9.32067555 58.25422222l0.58254223 5.82542222h-35.24380445v23.30168889h7.28177778c12.52465778 0 21.55406222 0.58254222 24.17550222 4.07779555 2.91271111 3.78652445 2.91271111 14.27228445 2.91271111 27.96202667v155.83004445c0 11.65084445-0.29127111 20.38897778-2.91271111 23.01041777-3.49525333 3.20398222-15.43736889 3.49525333-27.67075555 3.49525333h-7.28177778v25.9231289h214.95808l1.16508444-5.82542223c1.45635555-6.69923555 4.07779555-23.30168889 6.69923556-41.06922667 2.91271111-18.93262222 5.82542222-38.73905778 7.57304888-46.02083555l0.29127112-1.45635555h64.95345778v-23.59296l-6.69923556-0.58254223c-9.61194667-0.87381333-12.81592889-3.49525333-13.68974222-4.66033777-0.58254222-0.58254222-1.16508445-1.45635555-0.87381334-3.49525334 0.29127111-2.33016889 3.20398222-7.28177778 5.24288-10.77703111 0.87381333-1.45635555 1.74762667-2.91271111 2.33016889-4.07779555 9.02940445-16.31118222 15.14609778-25.63185778 25.34058667-40.77795556 3.49525333-5.24288 7.57304889-11.35957333 12.23338666-18.93262222 18.05880889 26.2144 32.62236445 50.09863111 42.52558223 66.40981333l1.45635555 2.33016889 0.29127112 0.29127111c2.91271111 4.36906667 4.36906667 8.44686222 4.66033777 10.48576-2.33016889 2.33016889-4.07779555 3.49525333-14.85482667 4.07779555l-7.86432-0.58254222-0.2912711 22.71914667H948.90666667v-23.88423111h-7.28177778z"/>\n' +
    '  <path d="M912.49777778 882.78812445H111.50222222c-11.94211555 0-23.01041778-5.82542222-29.70965333-15.4373689s-8.44686222-22.13660445-4.36906667-33.20490666L166.26119111 512l-88.83768889-322.14584889c-4.07779555-11.06830222-2.33016889-23.59296 4.36906667-33.20490666S99.85137778 141.21187555 111.50222222 141.21187555h400.49777778c20.09770667 0 36.40888889 16.31118222 36.40888889 36.4088889s-16.31118222 36.40888889-36.40888889 36.40888888H163.34848l75.73048889 285.44568889c2.91271111 7.86432 2.91271111 16.89372445 0 24.75804445l-75.73048889 285.73696H912.49777778c20.09770667 0 36.40888889 16.31118222 36.40888889 36.40888888s-16.31118222 36.40888889-36.40888889 36.4088889z"/>\n' +
    '</svg>');

  /**
   * 注册 Latex 按钮
   */
  editor.ui.registry.addButton('tinymce-latex', {
    title: conf.title,
    icon: 'latex',
    tooltip: conf.title,
    onSetup: () => {
      conf.renderId = editor.dom.uniqueId();
    },
    onAction: () => {
      onActionHandler(null);
    }
  });

  /**
   * 监听元素点击事件
   */
  editor.on('click', (e) => {
    const container = e.target.closest(conf.selector);
    if (container) {
      onActionHandler(container);
    }
  });

  /**
   * latex 插件的按钮点击响应方法
   * @param target 当前编辑的目标元素
   */
  const onActionHandler = (target) => {
    let latex: string = '';
    let container: HTMLIFrameElement;

    if (target) {
      latex = target.getAttribute(conf.latexId);
    }

    /** 打开公式会话窗口 */
    openLatexDialog(latex, (api) => {
      /** 获取公式并渲染 */
      const value = getLatexValue(api);
      renderLatexInNewDocument(container.contentDocument, value);
    }, (api) => {
      /** 提交公式 */
      const value = getLatexValue(api);
      if (target) {
        normalizeElNode(target, value);
        renderInTinyMCEDocument();
      } else {
        const element = document.createElement('span');
        normalizeElNode(element, value);
        editor.insertContent(element.outerHTML);
      }
      api.close();
    });

    /** 获取容器并渲染 */
    container = document.getElementById(conf.renderId) as HTMLIFrameElement;
    renderLatexInNewDocument(container.contentDocument, latex);
  };

  /**
   * 标准化元素节点
   * @param el    元素节点
   * @param latex 公式
   */
  const normalizeElNode = (el: HTMLElement, latex: string) => {
    el.innerHTML = latex;
    el.setAttribute(conf.latexId, latex);
    el.setAttribute('contenteditable', 'false');
    el.classList.add(conf.clazz);
    el.style.cursor = 'pointer';
    el.style.display = 'inline-block';
    el.style.marginLeft = '5px';
    el.style.marginRight = '5px';
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
   * 渲染 TinyMCE 编辑器文档内公式
   */
  const renderInTinyMCEDocument = () => {
    /** 渲染公式 */
    const doc = editor.getDoc();
    const elements = doc.querySelectorAll(conf.selector);
    for (const element of elements) {
      renderHTMLElement(element);
    }
  };

  /**
   * 重置 HTML 元素公式
   * @param el 元素
   */
  const resetHTMLElement = (el: HTMLElement) => {
    const latex = el.getAttribute(conf.latexId);
    el.removeAttribute('style');
    el.removeAttribute('contenteditable');
    el.removeAttribute('data-mce-style');
    el.removeAttribute(conf.latexId);
    el.innerHTML = normalizeLatex(latex);
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
    /** 重置元素，公式 latex 化 */
    const doc = editor.getDoc();
    const div = document.createElement('div');
    div.innerHTML = doc.body.innerHTML;
    const elements = div.querySelectorAll(conf.selector);
    // @ts-ignore
    for (const el of elements) {
      resetHTMLElement(el);
    }
    e.content = div.innerHTML;
  });

  /** 监听 before-set-content 事件 */
  editor.on('BeforeSetContent', function (e) {
    /** 公式去 latex 化 */
    const div = document.createElement('div') as HTMLElement;
    div.innerHTML = e.content;
    const elements = div.querySelectorAll(conf.selector);
    // @ts-ignore
    for (const element of elements) {
      let latex = element.getAttribute(conf.latexId);
      if (!latex) {
        latex = unNormalizeLatex(element.innerHTML);
      }
      normalizeElNode(element, latex);
    }
    e.content = div.innerHTML;
  });

  /** 监听 set-content 事件 */
  editor.on('SetContent', (e) => {
    renderInTinyMCEDocument();
  });

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
  const normalizeLatex = (latex: string) => {
    return `${conf.prefix}${latex}${conf.suffix}`;
  };

  /**
   * 将公式去 latex 化
   * @param latex 去规范化
   */
  const unNormalizeLatex = (latex: string) => {
    if (latex.length >= (conf.prefixLength + conf.suffixLength)) {
      return latex.substr(conf.prefixLength, latex.length - (conf.prefixLength + conf.suffixLength));
    }
  };
};
