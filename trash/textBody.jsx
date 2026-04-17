// this is the prev

// function TiptapEditor({ onChange, value }) {
//   // const [, forceUpdate] = useState();
//   const [linkModal, setLinkModal] = useState({
//     open: false,
//     url: "",
//     text: "",
//   });
//   const editorState = useEditorState({
//   editor,
//   selector: ({ editor }) => {
//     if (!editor) return {};

//     return {
//       bold: editor.isActive("bold"),
//       italic: editor.isActive("italic"),
//       underline: editor.isActive("underline"),
//       strike: editor.isActive("strike"),
//       subscript: editor.isActive("subscript"),
//       superscript: editor.isActive("superscript"),
//       link: editor.isActive("link"),
//       bulletList: editor.isActive("bulletList"),
//       orderedList: editor.isActive("orderedList"),
//       codeBlock: editor.isActive("codeBlock"),
//       blockquote: editor.isActive("blockquote"),
//       h1: editor.isActive("heading", { level: 1 }),
//       h2: editor.isActive("heading", { level: 2 }),
//       h3: editor.isActive("heading", { level: 3 }),
//     };
//   },
// });
//   const editor = useEditor({
//   extensions: [
    
//     StarterKit,
//     Markdown,

//     CustomLink.configure({
//       openOnClick: false,
//     }),

//     Subscript,
//     Superscript,

//     Placeholder.configure({
//       placeholder: "Write something amazing...",
//     }),
//   ],
//   //  shouldRerenderOnTransaction: false,

//   content: value || "Body text (optional)",
//   contentType: "markdown",
  

//   onUpdate: ({ editor }) => {
//     onChange(editor.getMarkdown());
//   },
// });

// useEffect(() => {
//   if (!editor) return;

//   const current = editor.getMarkdown();

//   if (value !== current) {
//     editor.commands.setContent(value || "", { contentType: "markdown" });
//   }

//   //  const update = () => forceUpdate({});
//   // editor.on("selectionUpdate", update);
//   // editor.on("transaction", update);
//   // return () => {
//   //   editor.off("selectionUpdate", update);
//   //   editor.off("transaction", update);
//   // };

// }, [value, editor]);

// const openLinkModal = () => {
//   const { from, to } = editor.state.selection;
//   const selectedText = editor.state.doc.textBetween(from, to);

//   setLinkModal({
//     open: true,
//     url: "",
//     text: selectedText || "",
//   });
// };


// const applyLink = () => {
//   if (!linkModal.url) return;

//   const { from, to } = editor.state.selection;

//   if (from !== to) {
//     // user selected text → apply link
//     editor
//       .chain()
//       .focus()
//       .extendMarkRange("link")
//       .setLink({ href: linkModal.url })
//       .run();
//   } else {
//     // no selection → insert new link text
//     // editor
//     //   .chain()
//     //   .focus()
//     //   .insertContent(
//     //     `<a href="${linkModal.url}">${linkModal.text || linkModal.url}</a>`
//     //   )
//     //   .run();
//       editor
//       .chain()
//       .focus()
//       .insertContent(linkModal.text || linkModal.url)
//       .extendMarkRange("link")
//       .setLink({ href: linkModal.url })
//       .run();
//   }

//   setLinkModal({ open: false, url: "", text: "" });
// };
//   if (!editor) return null;

//   return (
//     <div className="text-body-container">

//       {/* TOOLBAR */}
//       <div className="toolbar-text-body">

//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editorState.bold ? "active-btn" : ""}
//           type="button"
//           title="Bold"
//         >
//           <FontAwesomeIcon icon={faBold} className='icon-format'/>
//         </button>

//         <button 
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editorState.italic ? "active-btn" : ""}
//           type="button"
//           title="Italic"
//           >
//           <FontAwesomeIcon icon={faItalic} className='icon-format'/>
//         </button>

//         <button 
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={editorState.underline ? "active-btn" : ""}
//           type="button"
//           title="Underline"
//           >
//           <FontAwesomeIcon icon={faUnderline} className='icon-format'/>
//         </button>

//         <button 
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={editorState.strike ? "active-btn" : ""}
//           type="button"
//           title="Strikethrough"
//           >
//           <FontAwesomeIcon icon={faStrikethrough} className='icon-format'/>
//         </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleSubscript().run()}
//             className={editorState.subscript ? "active-btn" : ""}
//             title="Subscript"
//           >
//             <FontAwesomeIcon icon={faSubscript} className='icon-format'/>
//           </button>

//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleSuperscript().run()}
//             className={editorState.superscript ? "active-btn" : ""}
//             title="Superscript"
//           >
//            <FontAwesomeIcon icon={faSuperscript} className='icon-format'/>
//           </button>
//           <span style={{fontSize:'large'}}> | </span>
//         <button 
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           className={editorState.h1 ? "active-btn" : ""}
//           type="button"
//           title="Heading 1"
//           >
//           <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>1</sub>
//         </button>
//         <button 
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={editorState.h2 ? "active-btn" : ""}
//           type="button"
//           title="Heading 2"
//           >
//           <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>2</sub>
//         </button>
//         <button 
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           className={editorState.h3 ? "active-btn" : ""}
//           type="button"
//           title="Heading 3"
//           >
//           <FontAwesomeIcon icon={faHeading} className='icon-format'/><sub className='icon-format'>3</sub>
//         </button>

//         <span style={{fontSize:'large'}}> | </span>
//         <button 
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editorState.bulletList ? "active-btn" : ""}
//           type="button"
//           title="Bullet List"
//           >
//           <FontAwesomeIcon icon={faList} className='icon-format'/>
//         </button>

//         <button 
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={editorState.orderedList ? "active-btn" : ""}
//           type="button"
//           title="Number List"
//           >
//           <FontAwesomeIcon icon={faList12} className='icon-format'/>
//         </button>
//         <span style={{fontSize:'large'}}> | </span>
//         <button 
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//             className={editorState.codeBlock ? "active-btn" : ""}
//           type="button"
//           title="Code Block"
//           >
//           <FontAwesomeIcon icon={faCode} className='icon-format'/>
//         </button>
//           <button
//             type="button"
//             onClick={openLinkModal}
//             className={editorState.link ? "active-btn" : ""}
//             title="Link"
//           >
//             <FontAwesomeIcon icon={faLink} className='icon-format'/>
//           </button>
//         <button 
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={editorState.blockquote ? "active-btn" : ""}
//           type="button"
//           title="Blockquote"
//           >
//           <FontAwesomeIcon icon={faQuoteLeft} className='icon-format'/>
//         </button>
//       </div>

//       {/* EDITOR */}
//       <EditorContent
//         editor={editor}
//         className="p-4 min-h-[200px] prose max-w-none focus:outline-none"
//       />
//       {linkModal.open && (
//   <div className="link-modal">
//     <input
//       placeholder="Text"
//       value={linkModal.text}
//       onChange={(e) =>
//         setLinkModal({ ...linkModal, text: e.target.value })
//       }
//     />

//     <input
//       placeholder="https://..."
//       value={linkModal.url}
//       onChange={(e) =>
//         setLinkModal({ ...linkModal, url: e.target.value })
//       }
//     />

//     <div className="link-actions">
//       <button onClick={applyLink}>Apply</button>
//       <button onClick={() => setLinkModal({ open: false })}>
//         Cancel
//       </button>
//     </div>
//   </div>
// )}
//     </div>
    
//   );
// }
