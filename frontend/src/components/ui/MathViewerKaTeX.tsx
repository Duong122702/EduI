import katex from 'katex';
import 'katex/dist/katex.min.css';

export function MathViewerKaTeX({ value }: { value: string }) {
  // Render chuỗi LaTeX thành HTML
  const html = katex.renderToString(value || '', {
    throwOnError: false,
    displayMode: true, // Render dạng công thức khối hoặc false nếu muốn inline
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
