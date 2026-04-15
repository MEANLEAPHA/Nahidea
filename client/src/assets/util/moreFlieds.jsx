import React, { useState, memo, useEffect, useRef} from "react";
import TagInput from "../util/tagInput";
import MediaUploader from "../util/mediaUploader";
import { AnonymousToggle } from "../util/anonymousTokens";
import { EditOutlined ,TagsOutlined,CloudUploadOutlined   } from '@ant-design/icons';
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faUserSecret, faMask} from "@fortawesome/free-solid-svg-icons";
  import { faImages} from "@fortawesome/free-regular-svg-icons";


import { Extension } from "@tiptap/core";


import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";

import Placeholder from "@tiptap/extension-placeholder";


function TiptapEditor({ onChange, value }) {
const ClearFormattingOnEnter = Extension.create({
  name: "clearFormattingOnEnter",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        editor.chain().splitBlock().unsetAllMarks().run();
        return true;
      },
      "Shift-Enter": ({ editor }) => {
        editor.chain().setHardBreak().unsetAllMarks().run();
        return true;
      },
    };
  },
});

  const editor = useEditor({
    extensions: [
      StarterKit, // includes bold, italic, lists, code, etc :contentReference[oaicite:0]{index=0}
      Markdown,
      ClearFormattingOnEnter,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: value || "# Start writing...",
    contentType: "markdown",
    onUpdate: ({ editor }) => {
      const md = editor.getMarkdown(); // 🔥 IMPORTANT :contentReference[oaicite:1]{index=1}
      onChange(md);
    },
    
    
  });
useEffect(() => {
  if (!editor) return;

  const current = editor.getMarkdown();

  if (value !== current) {
    editor.commands.setContent(value || "", { contentType: "markdown" });
  }
}, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl shadow-md bg-white">

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active-btn" : ""}
          type="button"
        >
          <b>B</b>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active-btn" : ""}
          type="button"
          >
          <i>I</i>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "active-btn" : ""}
          type="button"
          >
          U
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active-btn" : ""}
          type="button"
          >
          S
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "active-btn" : ""}
          type="button"
          >
          H1
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "active-btn" : ""}
          type="button"
          >
          H2
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active-btn" : ""}
          type="button"
          >
          • List
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active-btn" : ""}
          type="button"
          >
          1. List
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active-btn" : ""}
          type="button"
          >
          {"</>"}
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active-btn" : ""}
          type="button"
          >
          "
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] prose max-w-none focus:outline-none"
      />
    </div>
  );
}


const MoreFields = memo(({
  tags, setTags,
  mediaFiles, setMediaFiles,
  isAnonymous, setIsAnonymous, tokens,
  setTextBodyValue, textBodyValue
}) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
    <div id="select-radio-type">
      <div className='radio-button-div-type'>
        {[{label: 'Text', icon: <EditOutlined />, id: 1},
                      {label: 'Image', icon: <FontAwesomeIcon icon={faImages} />, id: 2},
                      {label: 'Tags', icon: <TagsOutlined />, id: 3},
                      {label: 'Anonymous', icon: <FontAwesomeIcon icon={faMask} />, id: 4},
                    ].map((opt) => (
          <button key={opt.id} onClick={() => setSelected(opt.id)} type="button" className='radio-button-type' style={{
              borderBottom: selected === opt.id ? "3px solid #fd7648" : "3px solid transparent",
              color: selected === opt.id ? "#fd7648" : "grey",
            }}>
            {opt.icon}{" "}{opt.label}
          </button>
        ))}
      </div>
    </div>
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
     <div style={{ display: selected === 1 ? "block" : "none" }}>
        <TiptapEditor onChange={setTextBodyValue} value={textBodyValue}/>
      </div>
      {selected === 2 && <MediaUploader maxFiles={5} value={mediaFiles} onChange={setMediaFiles}/>}
      {selected === 3 && <TagInput value={tags} onChange={setTags} />}
      {selected === 4 && <AnonymousToggle enabled={isAnonymous} setEnabled={setIsAnonymous} tokens={tokens} />}
      </div>
      </>
  );
});

export default MoreFields;