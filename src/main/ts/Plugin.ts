declare const tinymce: any;

const setup = (editor, url) => {
  editor.ui.registry.addButton('tinymce-latex', {
    text: 'tinymce-latex button',
    onAction: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p>content added from tinymce-latex</p>');
    }
  });
};

export default () => {
  tinymce.PluginManager.add('tinymce-latex', setup);
};
