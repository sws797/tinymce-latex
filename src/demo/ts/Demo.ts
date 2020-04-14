import Plugin from '../../main/ts/Plugin';

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code tinymce-latex',
  toolbar: 'tinymce-latex',
  latex: {
    mathJax: {
      lib: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-svg.js'
    }
  },
  height: 800
});
