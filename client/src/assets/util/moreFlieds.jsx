import React, { useState, memo, useEffect, useRef} from "react";
import{TagInput} from "../util/tagInput";
import {MediaUploader} from "../util/mediaUploader";
import { AnonymousToggle } from "../util/anonymousTokens";
import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined   } from '@ant-design/icons';
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faUserSecret, faMask, faBold, faItalic, faUnderline, faStrikethrough, faHeading, faSubscript, faSuperscript, faQuoteLeft, faLink, faCode, faList, faList12} from "@fortawesome/free-solid-svg-icons";
  import { faImages} from "@fortawesome/free-regular-svg-icons";




import { useEditorState } from "@tiptap/react";
import { Extension } from "@tiptap/core";


import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
const CustomLink = Link.extend({
  inclusive: false, 
});


import Placeholder from "@tiptap/extension-placeholder";


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "../style/upload/Anonymous.css";
import "../style/upload/MultipleMedia.css";
import "../style/upload/TextBody.css";

function TiptapEditor({ onChange, value }) {
  const [linkModal, setLinkModal] = useState({
    open: false,
    url: "",
    text: "",
  });

  // ✅ 1. CREATE EDITOR FIRST
  const editor = useEditor({
    extensions: [
     StarterKit.configure({
        link: false, // 🚨 FIX duplicate
      }),
      Markdown,

      // CustomLink.configure({
      //   openOnClick: false,
      // }),
      CustomLink.configure({
  openOnClick: false,
  autolink: false,
  linkOnPaste: true,

  validate: href => {
    try {
      const url = new URL(href);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  },

  HTMLAttributes: {
    class: "editor-link",
    rel: "noopener noreferrer",
    target: "_blank",
  },
}),

      Placeholder.configure({
        placeholder: "Write Something Amazing...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      })

    ],

    content: value || null,
    contentType: "markdown",

   onUpdate: ({ editor }) => {
  onChange(editor.getMarkdown());
},


    // 🔥 performance control
    shouldRerenderOnTransaction: false,
  });

  // ✅ 2. STATE SELECTOR (AFTER editor exists)
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return {};

      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
        link: editor.isActive("link"),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        codeBlock: editor.isActive("codeBlock"),
        blockquote: editor.isActive("blockquote"),
        h1: editor.isActive("heading", { level: 1 }),
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
      };
    },
  });

  // ✅ sync external value
  useEffect(() => {
    if (!editor) return;

    const current = editor.getMarkdown();

    if (value !== current) {
      editor.commands.setContent(value, { contentType: "markdown" });
    }
  }, [value, editor]);

  const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);

    // only allow real web protocols
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};
const normalizeUrl = (url) => {
  if (!url) return "";

  // auto add https
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }

  return url;
};
  // 🔗 LINK MODAL
  const openLinkModal = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    setLinkModal({
      open: true,
      url: "",
      text: selectedText || "",
    });
  };

 const applyLink = () => {
  if (!editor || !linkModal.url) return;

  const url = normalizeUrl(linkModal.url);
  if (!isValidUrl(url)) {
    alert("Invalid URL");
    return;
  }

  const text = linkModal.text || url;

  // 🔥 always insert properly as link node
  editor
    .chain()
    .focus()
    .insertContent({
      type: "text",
      text: text,
      marks: [
        {
          type: "link",
          attrs: { href: url },
        },
      ],
    })
    .run();

  editor.commands.blur();

  setLinkModal({ open: false, url: "", text: "" });
};

  if (!editor) return null;

  return (
    <div className="text-body-container">
      <div className="toolbar-text-body">

        <button onClick={() => editor.chain().focus().toggleBold().run()}
          className={editorState.bold ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faBold} />
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editorState.italic ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faItalic} />
        </button>



        <button onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editorState.strike ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>


         <span style={{fontSize:'large'}}> | </span>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.h1 ? "active-btn" : ""}
          type="button"
          ><FontAwesomeIcon icon={faHeading} />1</button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.h2 ? "active-btn" : ""}
          type="button"
          ><FontAwesomeIcon icon={faHeading} />2</button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.h3 ? "active-btn" : ""}
          type="button"
          ><FontAwesomeIcon icon={faHeading} />3</button>

         <span style={{fontSize:'large'}}> | </span>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.bulletList ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faList} />
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.orderedList ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faList12} />
        </button>

         <span style={{fontSize:'large'}}> | </span>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.codeBlock ? "active-btn" : ""}
          type="button"
          >
          <FontAwesomeIcon icon={faCode} />
        </button>

        <button onClick={openLinkModal}
          className={editorState.link ? "active-btn" : ""}
          type="button">
          <FontAwesomeIcon icon={faLink} />
        </button>

        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.blockquote ? "active-btn" : ""}
          type="button"
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>

      </div>

      <EditorContent editor={editor} className="editor-body" />

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
          <div>
            <button onClick={applyLink} type="button">Apply</button>
            <button onClick={() => setLinkModal({ open: false })} type="button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const MemoEditor = memo(TiptapEditor);

 export const MoreFields = memo(({
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
        {[{label: 'Body Text', icon: <EditOutlined />, id: 1},
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
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px", overflow: "hidden", width: "100%"}}>
     <div style={{ display: selected === 1 ? "block" : "none" }}>
        <MemoEditor onChange={setTextBodyValue} value={textBodyValue}/>
      </div>
      {selected === 2 && <MediaUploader maxFiles={5} value={mediaFiles} onChange={setMediaFiles}/>}
      {selected === 3 && <TagInput value={tags} onChange={setTags} />}
      {selected === 4 && <AnonymousToggle enabled={isAnonymous} setEnabled={setIsAnonymous} tokens={tokens} />}
      </div>
      </>
  );
});




export const MarkdownPreview = ({ content }) => {
// const normalized = (content || "")
//   .replace(/^\s*\n+/, "")
//   .replace(/\n+\s*$/, "")
//   .replace(/\n{3,}/g, "\n\n"); 


  return (
    <div className="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]} >
        {/* {normalized} */}
        {content || ""}
      </ReactMarkdown>
    </div>
  );
};



 export const MoreFieldsConfession = memo(({
  tags, setTags,
  mediaFiles, setMediaFiles,
  isAnonymous, setIsAnonymous, tokens,
  confessionFileValue, setConfessionFileValue
}) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
    <div id="select-radio-type">
  
      <div className='radio-button-div-type'>
        {[
                      {label: 'Image', icon: <FontAwesomeIcon icon={faImages} />, id: 1},
                      {label: 'Tags', icon: <TagsOutlined />, id: 2},
                      {label: 'Anonymous', icon: <FontAwesomeIcon icon={faMask} />, id: 3},
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
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px", overflow: "hidden", width: "100%"}}>
     
      {selected === 1 && (<div>
          {
            confessionFileValue === null ? (
             
                <label >
                   <div className="confession-file-upload" style={{padding: '50px', backgroundColor: '#dd2626'}}>
                  <FontAwesomeIcon icon={faImages} />
                  <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setConfessionFileValue(e.target.files[0])}
                  style={{ display: "none" }}
                />
                  <p>Upload an image</p>
                   </div>
                </label>
             
            ) : (
              <div className="confession-file-preview">
                <img
                  src={URL.createObjectURL(confessionFileValue)}
                  alt="Confession"
                />
                <button
                  type="button"
                  onClick={() => setConfessionFileValue(null)}
                >
                  Remove
                </button>
              </div>
            )
          }
      </div>)}
      {selected === 2 && <TagInput value={tags} onChange={setTags} />}
      {selected === 3 && <AnonymousToggle enabled={isAnonymous} setEnabled={setIsAnonymous} tokens={tokens} />}
      </div>
      </>
  );
});

 export const MoreFieldsQuestion = memo(({
  tags, setTags,
  mediaFiles, setMediaFiles,
  isAnonymous, setIsAnonymous, tokens,
  questionFileValue, setQuestionFileValue
}) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
    <div id="select-radio-type">
  
      <div className='radio-button-div-type'>
        {[            
                      {label: 'Image', icon: <FontAwesomeIcon icon={faImages} />, id: 1},
                      {label: 'Tags', icon: <TagsOutlined />, id: 2},
                      {label: 'Anonymous', icon: <FontAwesomeIcon icon={faMask} />, id: 3},
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
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px", overflow: "hidden", width: "100%"}}>
     
      {selected === 1 && (<div>
          {
            questionFileValue === null ? (
             
                <label >
                   <div className="Question-file-upload" style={{padding: '50px', backgroundColor: '#dd2626'}}>
                  <FontAwesomeIcon icon={faImages} />
                  <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQuestionFileValue(e.target.files[0])}
                  style={{ display: "none" }}
                />
                  <p>Upload an image</p>
                   </div>
                </label>
             
            ) : (
              <div className="Question-file-preview">
                <img
                  src={URL.createObjectURL(questionFileValue)}
                  alt="Question"
                />
                <button
                  type="button"
                  onClick={() => setQuestionFileValue(null)}
                >
                  Remove
                </button>
              </div>
            )
          }
      </div>)}
      {selected === 2 && <TagInput value={tags} onChange={setTags} />}
      {selected === 3 && <AnonymousToggle enabled={isAnonymous} setEnabled={setIsAnonymous} tokens={tokens} />}
      </div>
      </>
  );
});