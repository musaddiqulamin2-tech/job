"use client";

export function Tb({ title, active, onClick, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`t-btn ${active ? "active" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ActionBar({
  editor,
  onInsertTemplate,
  onUploadImage,
  onSetLink,
  onInsertTable,
}) {
  if (!editor) return null;
  return (
    <div className="t-toolbar" role="toolbar" aria-label="Formatting toolbar">
      <div className="t-tool-group">
        <Tb
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </Tb>
        <Tb
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </Tb>
        <Tb
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Tb>
        <Tb
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </Tb>
        <Tb
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </Tb>
        <Tb
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          &lt;/&gt;
        </Tb>
        <Tb
          title="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <span style={{ background: "#fde68a", padding: "0 4px", borderRadius: 3 }}>H</span>
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Tb>
        <Tb
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Tb>
        <Tb
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Tb>
        <Tb
          title="Heading 4"
          active={editor.isActive("heading", { level: 4 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          H4
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Tb>
        <Tb
          title="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Tb>
        <Tb
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Tb>
        <Tb
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          &lt;code&gt;
        </Tb>
        <Tb
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ──
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </Tb>
        <Tb
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬌
        </Tb>
        <Tb
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb title="Insert link" active={editor.isActive("link")} onClick={onSetLink}>
          🔗
        </Tb>
        <Tb
          title={editor.isActive("link") ? "Remove link" : "Link"}
          active={false}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
            }
          }}
        >
          ➖
        </Tb>
        <Tb title="Insert image" onClick={onUploadImage}>
          🖼
        </Tb>
        <Tb title="Insert table" onClick={onInsertTable}>
          ▦
        </Tb>
      </div>

      <div className="t-tool-group">
        <Tb onClick={() => editor.chain().focus().addRowAfter().run()} title="Insert row below">
          ＋ Row
        </Tb>
        <Tb onClick={() => editor.chain().focus().deleteRow().run()} title="Delete row">
          －Row
        </Tb>
        <Tb onClick={() => editor.chain().focus().addColumnAfter().run()} title="Insert column right">
          ＋Col
        </Tb>
        <Tb onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete column">
          －Col
        </Tb>
      </div>

      <button type="button" className="t-btn t-btn-fill" onClick={onInsertTemplate}>
        Insert Job Template
      </button>
    </div>
  );
}