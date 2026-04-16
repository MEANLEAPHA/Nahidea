import React, { useState, memo, useEffect, useRef} from "react";
import TagInput from "../util/tagInput";
import MediaUploader from "../util/mediaUploader";
import { AnonymousToggle } from "../util/anonymousTokens";
import { EditOutlined ,TagsOutlined,CloudUploadOutlined   } from '@ant-design/icons';
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faUserSecret, faMask, faBold, faItalic, faUnderline, faStrikethrough, faHeading, faSubscript, faSuperscript, faQuoteLeft, faLink, faCode, faList, faList12} from "@fortawesome/free-solid-svg-icons";
  import { faImages} from "@fortawesome/free-regular-svg-icons";



import { Extension } from "@tiptap/core";


import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
const CustomLink = Link.extend({
  inclusive: false, 
});

import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";


import "../style/upload/Anonymous.css";
import "../style/upload/MultipleMedia.css";
import "../style/upload/TextBody.css";
// this is the prev

function TiptapEditor({ onChange, value }) {
  const [, forceUpdate] = useState();
  const [linkModal, setLinkModal] = useState({
    open: false,
    url: "",
    text: "",
  });
  // const editor = useEditor({
  //   extensions: [
  //     StarterKit, // includes bold, italic, lists, code, etc :contentReference[oaicite:0]{index=0}
  //     Markdown,
  //     Placeholder.configure({
  //       placeholder: "Write something amazing...",
  //     }),
  //   ],
  //   content: value || "# Start writing...",
  //   contentType: "markdown",
  //   onUpdate: ({ editor }) => {
  //     const md = editor.getMarkdown(); // 🔥 IMPORTANT :contentReference[oaicite:1]{index=1}
  //     onChange(md);
  //   },
  // });

  const editor = useEditor({
  extensions: [
    
    StarterKit,
    Markdown,

    CustomLink.configure({
      openOnClick: false,
    }),

    Subscript,
    Superscript,

    Placeholder.configure({
      placeholder: "Write something amazing...",
    }),
  ],

  content: value || "Body text (optional)",
  contentType: "markdown",

  onUpdate: ({ editor }) => {
    onChange(editor.getMarkdown());
  },
});

useEffect(() => {
  if (!editor) return;

  const current = editor.getMarkdown();

  if (value !== current) {
    editor.commands.setContent(value || "", { contentType: "markdown" });
  }

   const update = () => forceUpdate({});

  editor.on("selectionUpdate", update);
  editor.on("transaction", update);

  return () => {
    editor.off("selectionUpdate", update);
    editor.off("transaction", update);
  };

}, [value, editor]);

const openLinkModal = () => {
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to);

  setLinkModal({
    open: true,
    url: "",
    text: selectedText || "",
  });
};


const applyLink = () => {
  if (!linkModal.url) return;

  const { from, to } = editor.state.selection;

  if (from !== to) {
    // user selected text → apply link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkModal.url })
      .run();
  } else {
    // no selection → insert new link text
    editor
      .chain()
      .focus()
      .insertContent(
        `<a href="${linkModal.url}">${linkModal.text || linkModal.url}</a>`
      )
      .run();
  }

  setLinkModal({ open: false, url: "", text: "" });
};
  if (!editor) return null;

  return (
    <div className="text-body-container">

      {/* TOOLBAR */}
      <div className="toolbar-text-body">

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active-btn" : ""}
          type="button"
        >
          <FontAwesomeIcon icon={faBold} className='icon-format'/>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faItalic} className='icon-format'/>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faUnderline} className='icon-format'/>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faStrikethrough} className='icon-format'/>
        </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive("subscript") ? "active-btn" : ""}
          >
            <FontAwesomeIcon icon={faSubscript} className='icon-format'/>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive("superscript") ? "active-btn" : ""}
          >
           <FontAwesomeIcon icon={faSuperscript} className='icon-format'/>
          </button>
          <span style={{fontSize:'large'}}> | </span>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>1</sub>
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>2</sub>
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>3</sub>
        </button>

        <span style={{fontSize:'large'}}> | </span>
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faList} className='icon-format'/>
        </button>

        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faList12} className='icon-format'/>
        </button>
        <span style={{fontSize:'large'}}> | </span>
        <button 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faCode} className='icon-format'/>
        </button>
        {/* <button
            type="button"
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={editor.isActive("link") ? "active-btn" : ""}
          >
          <FontAwesomeIcon icon={faLink} />
          </button> */}
          <button
            type="button"
            onClick={openLinkModal}
            className={editor.isActive("link") ? "active-btn" : ""}
          >
            <FontAwesomeIcon icon={faLink} className='icon-format'/>
          </button>
        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faQuoteLeft} className='icon-format'/>
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] prose max-w-none focus:outline-none"
      />
      {linkModal.open && (
  <div className="link-modal">
    <input
      placeholder="Text"
      value={linkModal.text}
      onChange={(e) =>
        setLinkModal({ ...linkModal, text: e.target.value })
      }
    />

    <input
      placeholder="https://..."
      value={linkModal.url}
      onChange={(e) =>
        setLinkModal({ ...linkModal, url: e.target.value })
      }
    />

    <div className="link-actions">
      <button onClick={applyLink}>Apply</button>
      <button onClick={() => setLinkModal({ open: false })}>
        Cancel
      </button>
    </div>
  </div>
)}
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