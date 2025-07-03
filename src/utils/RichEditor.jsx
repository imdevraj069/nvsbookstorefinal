"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Highlighter,
  PaintBucket, Eraser, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List,
  ListOrdered, Quote, Minus, TableIcon, Rows, Columns, Trash, Merge,
  Split, CornerDownLeft, CornerDownRight, ArrowLeftFromLine,
  ArrowRightFromLine, TableRowsSplit, TableColumnsSplitIcon, Link as LinkIcon,
  ImageIcon, Upload, Loader2
} from "lucide-react";

import "./global.css";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => ({ fontSize: element.style.fontSize }),
            renderHTML: (attributes) => attributes.fontSize ? {
              style: `font-size: ${attributes.fontSize}`
            } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) =>
        chain().setMark("textStyle", { fontSize }).run(),
    };
  },
});

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => ({
          "data-background-color": attributes.backgroundColor,
          style: `background-color: ${attributes.backgroundColor}`,
        }),
      },
    };
  },
});

// Enhanced Image extension with resizing capabilities
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
    };
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement("div");
      container.className = "image-container relative inline-block group";
      
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.className = "max-w-full h-auto rounded-lg shadow-md";
      
      if (node.attrs.width) img.style.width = node.attrs.width;
      if (node.attrs.height) img.style.height = node.attrs.height;
      
      // Resize handles
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity";
      
      // Replace button
      const replaceButton = document.createElement("button");
      replaceButton.className = "absolute top-2 right-2 bg-gray-800 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity";
      replaceButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
      
      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "absolute top-2 left-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity";
      deleteButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
      
      container.appendChild(img);
      container.appendChild(resizeHandle);
      container.appendChild(replaceButton);
      container.appendChild(deleteButton);
      
      // Resize functionality
      let isResizing = false;
      let startX, startY, startWidth, startHeight;
      
      resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(img).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(img).height, 10);
        e.preventDefault();
      });
      
      document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        
        const width = startWidth + e.clientX - startX;
        const height = startHeight + e.clientY - startY;
        
        img.style.width = width + "px";
        img.style.height = height + "px";
      });
      
      document.addEventListener("mouseup", () => {
        if (isResizing) {
          isResizing = false;
          const pos = getPos();
          editor.commands.updateAttributes("image", {
            width: img.style.width,
            height: img.style.height,
          });
        }
      });
      
      // Replace functionality
      replaceButton.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            
            try {
              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              
              if (response.ok) {
                const data = await response.json();
                const pos = getPos();
                editor.commands.updateAttributes("image", {
                  src: data.url,
                });
              }
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }
        };
        input.click();
      });
      
      // Delete functionality
      deleteButton.addEventListener("click", () => {
        const pos = getPos();
        editor.commands.deleteRange({ from: pos, to: pos + 1 });
      });
      
      return {
        dom: container,
      };
    };
  },
});

const extensions = [
  StarterKit,
  TextStyle.extend({
    addAttributes() {
      return {
        color: {
          default: null,
          parseHTML: (element) => element.style.color || null,
          renderHTML: (attrs) => attrs.color ? { style: `color: ${attrs.color}` } : {},
        },
        backgroundColor: {
          default: null,
          parseHTML: (element) => element.style.backgroundColor || null,
          renderHTML: (attrs) => attrs.backgroundColor ? { style: `background-color: ${attrs.backgroundColor}` } : {},
        },
      };
    },
  }),
  Color,
  FontSize,
  Underline,
  Highlight,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  CustomTableCell,
  Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
  ResizableImage.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg shadow-md",
    },
  }),
];

const EditorButton = ({ onClick, children, disabled, loading }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="ghost"
    className="text-white p-1 disabled:opacity-40"
    disabled={disabled || loading}
  >
    {loading ? <Loader2 size={16} className="animate-spin" /> : children}
  </Button>
);

const ImageUploadButton = ({ editor }) => {
  const [uploading, setUploading] = useState(false);
  
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      setUploading(true);
      
      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          
          if (response.ok) {
            const data = await response.json();
            editor.commands.setImage({
              src: data.url,
              alt: file.name,
            });
          } else {
            console.error("Failed to upload image:", await response.text());
          }
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setUploading(false);
      }
    };
    
    input.click();
  }, [editor]);
  
  return (
    <EditorButton onClick={handleImageUpload} loading={uploading}>
      <ImageIcon size={16} />
    </EditorButton>
  );
};

export function MenuBar({ editor }) {
  if (!editor) return null;

  return (
    <div className="space-y-2 p-2 bg-gray-900 rounded-t-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Text Styling */}
        <div className="flex flex-wrap items-center gap-2">
          <EditorButton onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleCode().run()}><Code size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().setMark("textStyle", { color: null, backgroundColor: null }).run()}><Eraser size={16} /></EditorButton>
        </div>

        {/* Colors and Font Sizes */}
        <div className="flex items-center gap-2">
          <select
            className="px-2 py-1 text-sm text-white bg-gray-800 rounded"
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          >
            <option value="">Size</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
            <option value="32px">32</option>
          </select>
          <label className="relative w-6 h-6">
            <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} className="opacity-0 absolute w-full h-full cursor-pointer" />
            <PaintBucket size={16} className="text-white absolute inset-0 m-auto" />
          </label>
          <label className="relative w-6 h-6">
            <input type="color" onChange={(e) => editor.chain().focus().setMark("textStyle", { backgroundColor: e.target.value }).run()} className="opacity-0 absolute w-full h-full cursor-pointer" />
            <Highlighter size={16} className="text-white absolute inset-0 m-auto" />
          </label>
        </div>

        {/* Headings & Alignment */}
        <div className="flex flex-wrap items-center gap-2">
          {[Heading1, Heading2, Heading3].map((H, i) => (
            <EditorButton key={i} onClick={() => editor.chain().focus().toggleHeading({ level: i + 1 }).run()}><H size={16} /></EditorButton>
          ))}
          <EditorButton onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().setTextAlign("justify").run()}><AlignJustify size={16} /></EditorButton>
        </div>

        {/* Blocks */}
        <div className="flex flex-wrap items-center gap-2">
          <EditorButton onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></EditorButton>
        </div>

        {/* Media and Table Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <ImageUploadButton editor={editor} />
          <EditorButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}><Rows size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}><Columns size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().deleteTable().run()}><Trash size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}><Merge size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}><Split size={16} /></EditorButton>
        </div>

        {/* Table Cell Styling */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="relative w-6 h-6">
              <input
                type="color"
                onChange={(e) => editor.chain().focus().setCellAttribute("backgroundColor", e.target.value).run()}
                className="opacity-0 absolute w-full h-full cursor-pointer"
              />
              <PaintBucket size={16} className="text-white absolute inset-0 m-auto" />
            </label>
          </div>
        </div>

        {/* Links and Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <EditorButton onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}><LinkIcon size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}><ArrowRightFromLine size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}><ArrowLeftFromLine size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().undo().run()}><CornerDownLeft size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().redo().run()}><CornerDownRight size={16} /></EditorButton>
        </div>
      </div>
    </div>
  );
}

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap",
        spellCheck: "false",
      },
    },
  });

  return (
    <div className="space-y-4 relative">
      <div className="relative border rounded-xl max-h-[80vh] overflow-auto">
        <div className="sticky top-0 z-20 bg-gray-900 rounded-t-xl">
          <MenuBar editor={editor} />
        </div>
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-full border-t p-4 bg-white dark:bg-zinc-900 min-h-[400px]"
        />
      </div>
    </div>
  );
}