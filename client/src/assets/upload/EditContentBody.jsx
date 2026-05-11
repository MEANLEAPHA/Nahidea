import React, {useEffect, useState, memo, useRef} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined   } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faMask, faBold, faItalic, faUnderline, faStrikethrough, faHeading, faSubscript, faSuperscript, faQuoteLeft, faLink, faCode, faList, faList12} from "@fortawesome/free-solid-svg-icons";
import { faImages} from "@fortawesome/free-regular-svg-icons";

import {DeleteOutlined} from '@ant-design/icons';

import {RightOutlined , CloseOutlined, PlusOutlined, ClearOutlined, LeftOutlined} from '@ant-design/icons';

import { useEditorState } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 

import "../style/upload/TextBody.css";

const CustomLink = Link.extend({
  inclusive: false, 
});


const token = localStorage.getItem("token");

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
 
const EditContentBody = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [textBodyValue, setTextBodyValue] = useState('');

    useEffect(() => {
        if (state?.bodyText) {
          setTextBodyValue(state.bodyText);
          setPage(state.page);
        } else {
          setTextBodyValue(""); // ✅ clear when no state
          setPage(1);
        }
    },[state]);

    const handleUpdate = async() => {
        try{
            const res = await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/update-post-body-content/${state.contentId}/${state.postId}`,
                { bodyText: textBodyValue
          
                 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if(res.status === 200) navigate(-1);
            console.log(res.data);
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <div>
            <h1>Edit Content</h1>
           <TiptapEditor value={textBodyValue} onChange={setTextBodyValue} />
          <button type="submit" onClick={handleUpdate} className="btn">submit</button>
        </div>
    );
}

export default EditContentBody