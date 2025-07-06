// TiptapEditor.jsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from 'tiptap-extension-font-size';
import CharacterCount from "@tiptap/extension-character-count";
import React, { useCallback, useEffect, useState } from "react";

// Tiptap Core imports needed for custom extensions
import { Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/react';

// Import CSS for Tiptap and specific extensions
import "./TiptapEditor.css";

// Import Lucide React Icons
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List as BulletListIcon, ListOrdered as OrderedListIcon,
  Minus, // Horizontal Rule
  Link as LinkIcon, Link2Off,
  Image as ImageIcon,
  Table as TableIcon, Table2,
  Trash2,
  Undo, Redo,
  Maximize, Minimize, Code, // Import Minimize icon for exiting fullscreen
  Palette, Highlighter,
  Font, Type,
  Plus,
} from "lucide-react";


// --- EditorButton Component ---
const EditorButton = ({ children, className = "", ...props }) => {
  return (
    <button
      type="button"
      className={`px-3 py-1 rounded text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 flex items-center justify-center gap-1 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
// --- End EditorButton Component ---

// --- Separator Component ---
const Separator = () => (
  <div className="w-px bg-gray-300 dark:bg-zinc-600 mx-1 h-6 self-center"></div>
);
// --- End Separator Component ---

// --- Custom ImageLink Tiptap Extension ---
const ImageLink = Node.create({
  name: 'imageLink',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        renderHTML: ({ src }) => {
          if (!src) return {};
          return { src };
        },
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      href: {
        default: null,
        renderHTML: ({ href }) => {
          if (!href) return {};
          return { href };
        },
      },
      target: {
        default: '_blank',
        renderHTML: ({ target }) => {
          if (!target) return {};
          return { target };
        },
      },
      rel: {
        default: 'noopener noreferrer',
        renderHTML: ({ rel }) => {
          if (!rel) return {};
          return { rel };
        },
      },
      width: {
        default: null,
        renderHTML: ({ width }) => {
          return width ? { width } : {};
        },
      },
      height: {
        default: null,
        renderHTML: ({ height }) => {
          return height ? { height } : {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[href] > img[src]',
        getAttrs: (node) => {
          const img = node.querySelector('img');
          if (!img) return false;

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            href: node.getAttribute('href'),
            target: node.getAttribute('target'),
            rel: node.getAttribute('rel'),
            width: img.style.width || img.getAttribute('width'),
            height: img.style.height || img.getAttribute('height'),
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => {
          return {
            src: node.getAttribute('src'),
            alt: node.getAttribute('alt'),
            title: node.getAttribute('title'),
            href: null,
            target: null,
            rel: null,
            width: node.style.width || node.getAttribute('width'),
            height: node.style.height || node.getAttribute('height'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const imgAttrs = mergeAttributes({
      src: HTMLAttributes.src,
      alt: HTMLAttributes.alt,
      title: HTMLAttributes.title,
      width: HTMLAttributes.width,
      height: HTMLAttributes.height,
      style: `max-width: 100%; height: auto; ${HTMLAttributes.width ? `width: ${HTMLAttributes.width};` : ''} ${HTMLAttributes.height ? `height: ${HTMLAttributes.height};` : ''}`,
      class: 'tiptap-image-node',
    });

    if (HTMLAttributes.href) {
      return [
        'a',
        mergeAttributes({ href: HTMLAttributes.href, target: HTMLAttributes.target, rel: HTMLAttributes.rel }),
        ['img', imgAttrs]
      ];
    }
    return ['img', imgAttrs];
  },

  addCommands() {
    return {
      setImageLink:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateImageLink:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
      unsetImageLink:
        () =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { href: null, target: null, rel: null });
        },
      setImageSize:
        (width, height) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { width, height });
        },
    };
  },
});
// --- End Custom ImageLink Tiptap Extension ---


// --- Custom TableCell Tiptap Extension (for background color) ---
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || null,
        renderHTML: attributes => {
          return attributes.backgroundColor
            ? { style: `background-color: ${attributes.backgroundColor}` }
            : {};
        },
      },
    };
  },
});
// --- End Custom TableCell Tiptap Extension ---


const MenuBar = ({ editor, onContentChange, toggleFullscreen, isFullscreen }) => { // Pass toggleFullscreen and isFullscreen
  if (!editor) {
    return null;
  }

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          // Replace with your actual image upload API endpoint
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (result.url) {
            editor.chain().focus().setImageLink({ src: result.url, alt: file.name, href: '' }).run();
            setTimeout(() => {
              const url = window.prompt("Image URL: " + result.url + "\nEnter a link for this image (optional):");
              if (url) {
                editor.chain().focus().updateImageLink({ href: url, target: '_blank' }).run();
              }
            }, 100);
          } else {
            console.error("Image upload failed: No URL returned", result);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
    input.click();
  }, [editor]);

  const setOrUpdateImageLink = useCallback(() => {
    const currentAttrs = editor.getAttributes('imageLink');
    const initialHref = currentAttrs.href || '';
    const url = window.prompt("Enter URL for image:", initialHref);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().unsetImageLink().run();
    } else {
      editor.chain().focus().updateImageLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run();
    }
  }, [editor]);

  const promptImageSize = useCallback(() => {
    const currentAttrs = editor.getAttributes('imageLink');
    const initialWidth = currentAttrs.width || '';
    const initialHeight = currentAttrs.height || 'auto';

    const newWidth = window.prompt("Enter image width (e.g., 300px, 50%):", initialWidth);
    if (newWidth === null) return;

    const newHeight = window.prompt("Enter image height (e.g., 200px, auto for aspect ratio):", initialHeight);
    if (newHeight === null) return;

    editor.chain().focus().setImageSize(newWidth, newHeight).run();
  }, [editor]);

  const setTableCellBackgroundColor = useCallback((color) => {
    editor.chain().focus().setCellAttribute('backgroundColor', color).run();
  }, [editor]);

  const unsetTableCellBackgroundColor = useCallback(() => {
    editor.chain().focus().setCellAttribute('backgroundColor', null).run();
  }, [editor]);


  return (
    <div className="tiptap-menubar p-2 border-b border-gray-300 dark:border-zinc-700 flex flex-wrap gap-1 sticky top-0 bg-white dark:bg-zinc-900 z-10">

      {/* --- Text Formatting Group --- */}
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
      >
        <Bold size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
      >
        <Italic size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "is-active" : ""}
        title="Superscript"
      >
        <SuperscriptIcon size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "is-active" : ""}
        title="Subscript"
      >
        <SubscriptIcon size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <Eraser size={18} />
      </EditorButton>

      <Separator />

      {/* --- Font & Color Group --- */}
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        value={editor.getAttributes("textStyle").fontFamily || ""}
        title="Font Family"
        className="px-2 py-1 rounded text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600"
      >
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
      </select>

      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        value={editor.getAttributes('fontSize').fontSize || ''}
        title="Font Size"
        className="px-2 py-1 rounded text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600"
      >
        <option value="">Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
        <option value="36px">36px</option>
        <option value="40px">40px</option>
        <option value="48px">48px</option>
        <option value="56px">56px</option>
        <option value="60px">60px</option>
        <option value="72px">72px</option>

      </select>

      <div className="flex items-center gap-1 group relative">
        <EditorButton className="flex items-center gap-1" title="Text Color">
          <Palette size={18} />
          <input
            type="color"
            onInput={event => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </EditorButton>
        {editor.getAttributes('textStyle').color && (
          <EditorButton
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Unset Text Color"
          >
            <Eraser size={18} />
          </EditorButton>
        )}
      </div>

      <div className="flex items-center gap-1 group relative">
        <EditorButton className="flex items-center gap-1" title="Highlight Color">
          <Highlighter size={18} />
          <input
            type="color"
            onInput={event => editor.chain().focus().setHighlight({ color: event.target.value }).run()}
            value={editor.isActive('highlight') ? editor.getAttributes('highlight').color : '#FFFFFF'}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </EditorButton>
        {editor.isActive('highlight') && (
          <EditorButton
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            title="Unset Highlight"
          >
            <Eraser size={18} />
          </EditorButton>
        )}
      </div>

      <Separator />

      {/* --- Block & Alignment Group --- */}
      <select
        onChange={(e) => {
          if (e.target.value === "paragraph") editor.chain().focus().setParagraph().run();
          else if (e.target.value === "blockquote") editor.chain().focus().setBlockquote().run();
          else if (e.target.value.startsWith("h")) {
            editor.chain().focus().toggleHeading({ level: parseInt(e.target.value.substring(1)) }).run();
          }
        }}
        value={editor.isActive("paragraph") ? "paragraph" :
               editor.isActive("blockquote") ? "blockquote" :
               editor.isActive("heading", { level: 1 }) ? "h1" :
               editor.isActive("heading", { level: 2 }) ? "h2" :
               editor.isActive("heading", { level: 3 }) ? "h3" :
               editor.isActive("heading", { level: 4 }) ? "h4" :
               editor.isActive("heading", { level: 5 }) ? "h5" :
               editor.isActive("heading", { level: 6 }) ? "h6" : "paragraph"}
        title="Block Format"
        className="px-2 py-1 rounded text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="blockquote">Blockquote</option>
      </select>

      <EditorButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        title="Align Right"
      >
        <AlignRight size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
        title="Align Justify"
      >
        <AlignJustify size={18} />
      </EditorButton>

      <Separator />

      {/* --- List & Rule Group --- */}
      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet List"
      >
        <BulletListIcon size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        title="Ordered List"
      >
        <OrderedListIcon size={18} />
      </EditorButton>
      <EditorButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus size={18} />
      </EditorButton>

      <Separator />

      {/* --- Link & Image Group --- */}
      <EditorButton
        onClick={() => {
          const url = window.prompt("Enter URL for text link:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "is-active" : ""}
        title="Insert Text Link"
      >
        <LinkIcon size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Unset Text Link"
      >
        <Link2Off size={18} />
      </EditorButton>

      <EditorButton onClick={handleImageUpload} title="Insert Image">
        <ImageIcon size={18} />
      </EditorButton>
      {editor.isActive('imageLink') && (
        <>
          <EditorButton
            onClick={setOrUpdateImageLink}
            title="Edit Image Link"
          >
            <LinkIcon size={18} />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().unsetImageLink().run()}
            disabled={!editor.getAttributes('imageLink').href}
            title="Remove Image Link"
          >
            <Link2Off size={18} />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            title="Align Image Left"
          >
            <AlignLeft size={18} />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            title="Align Image Center"
          >
            <AlignCenter size={18} />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            title="Align Image Right"
          >
            <AlignRight size={18} />
          </EditorButton>
          <EditorButton
            onClick={promptImageSize}
            title="Set Image Size"
          >
            <Type size={18} />
          </EditorButton>
        </>
      )}

      <Separator />

      {/* --- Table Group --- */}
      <EditorButton
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        title="Insert Table"
      >
        <TableIcon size={18} />
      </EditorButton>
      {editor.isActive('table') && (
        <>
          <EditorButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="Add Row After"
          >
            <Plus size={18} /> (Row)
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            title="Delete Row"
          >
            <Table2 size={18} /> (Del Row)
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="Add Column After"
          >
            <Plus size={18} /> (Col)
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            title="Delete Column"
          >
            <Table2 size={18} /> (Del Col)
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Delete Table"
          >
            <Trash2 size={18} /> (Table)
          </EditorButton>
          <div className="flex items-center gap-1 group relative">
            <EditorButton
              className="flex items-center gap-1"
              title="Table Cell Background Color"
            >
              <Palette size={18} /> (Cell)
              <input
                type="color"
                onInput={event => setTableCellBackgroundColor(event.target.value)}
                value={editor.getAttributes('tableCell').backgroundColor || '#FFFFFF'}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </EditorButton>
            {editor.getAttributes('tableCell').backgroundColor && (
              <EditorButton
                onClick={unsetTableCellBackgroundColor}
                title="Unset Table Cell Background Color"
              >
                <Eraser size={18} /> (Cell)
              </EditorButton>
            )}
          </div>
        </>
      )}

      <Separator />

      {/* --- Undo/Redo & Utilities Group --- */}
      <EditorButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
      >
        <Undo size={18} />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        <Redo size={18} />
      </EditorButton>

      <EditorButton
        onClick={toggleFullscreen} // Call the toggleFullscreen function
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} // Change title based on state
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />} {/* Change icon */}
      </EditorButton>
      <EditorButton onClick={() => alert(`HTML Content:\n\n${editor.getHTML()}`)} title="View HTML">
        <Code size={18} />
      </EditorButton>

      <div className="char-count mt-2 text-right w-full text-sm text-gray-500">
        Characters: {editor.storage.characterCount.characters()} / Words: {editor.storage.characterCount.words()}
      </div>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }) {
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        strike: true,
        blockquote: true,
        bulletList: true,
        orderedList: true,
        horizontalRule: true,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        image: false,
      }),
      Underline,
      Superscript,
      SubScript,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      ImageLink,
      Table.configure({
        resizable: true,
      }),
      CustomTableCell,
      TableHeader,
      TableRow,
      TextAlign.configure({
        types: ["heading", "paragraph", "imageLink"],
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize,
      CharacterCount,
    ],
    content: content || "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none p-4 outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  if (!editor) {
    return (
      <div className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-xl bg-white dark:bg-zinc-900 min-h-[500px] max-h-[700px] flex flex-col overflow-hidden ${
        isFullscreen ? "tiptap-fullscreen" : "" // Apply fullscreen class conditionally
      }`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto relative">
        <MenuBar editor={editor} toggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} /> {/* Pass props to MenuBar */}
        <EditorContent editor={editor} className="flex-grow" />
      </div>
    </div>
  );
}