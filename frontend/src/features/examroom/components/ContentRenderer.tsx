import { BlockMath, InlineMath } from 'react-katex';
interface ContentRendererProps {
  content: string;
  block?: boolean;
  className?: string;
  imageUrl?: string;
}

export const ContentRenderer = ({
  content,
  block = false,
  className,
  imageUrl,
}: ContentRendererProps) => {
  if (!content && !imageUrl) return null;
  const renderParsedContent = (text: string) => {
    // 1. Kiểm tra nhanh: Nếu chuỗi KHÔNG chứa \text{...}
    // thì render toàn bộ là công thức như bình thường
    if (!text.includes('\\text{')) {
      return block ? (
        <BlockMath
          math={text}
          renderError={(error) => (
            <span className="font-medium text-red-500">{error.message}</span>
          )}
        />
      ) : (
        <InlineMath
          math={text}
          renderError={(error) => (
            <span className="font-medium text-red-500">{error.message}</span>
          )}
        />
      );
    }

    // 2. Nếu có \text{...}, tiến hành tách chuỗi
    const parts = text.split(/\\text\{([^}]*)\}/g);

    return parts.map((part, index) => {
      if (!part) return null;

      if (index % 2 === 0) {
        // Phần Toán học (KaTeX)
        return (
          <InlineMath
            key={index}
            math={part}
            renderError={() => (
              // MẸO XỬ LÝ CHỮ "Đạo":
              // Khi gặp chữ tiếng Việt nằm ngoài \text{} (gây lỗi KaTeX),
              // thay vì báo lỗi đỏ, ta tự động in nó ra như một đoạn text bình thường.
              <span className="mx-1">{part}</span>
            )}
          />
        );
      } else {
        // Phần Chữ bình thường (bên trong \text{})
        return (
          <span key={index} className="mx-1">
            {part}
          </span>
        );
      }
    });
  };

  const Wrapper = (block ? 'div' : 'span') as keyof JSX.IntrinsicElements;
  return (
    <Wrapper className={`text-gray-800 ${className}`}>
      {content && renderParsedContent(content)}
      {/* 2. Hiển thị phần ảnh (nếu có) */}
      {imageUrl &&
        (block ? (
          <img
            src={imageUrl}
            alt="Hình ảnh minh họa toán học"
            className="mx-auto mt-4 max-h-80 max-w-full rounded-lg border border-gray-100 object-contain shadow-sm"
          />
        ) : (
          <img
            src={imageUrl}
            alt="Hình minh họa"
            className="ml-2 inline-block h-6 w-auto rounded align-middle"
          />
        ))}
    </Wrapper>
  );
};
