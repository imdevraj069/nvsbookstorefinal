"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Highlighter,
  PaintBucket, Eraser, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List,
  ListOrdered, Quote, Minus, TableIcon, Rows, Columns, Trash, Merge,
  Split, CornerDownLeft, CornerDownRight, ArrowLeftFromLine,
  ArrowRightFromLine, TableRowsSplit, TableColumnsSplitIcon, Link as LinkIcon
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
];

const EditorButton = ({ onClick, children, disabled }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="ghost"
    className="text-white p-1 disabled:opacity-40"
    disabled={disabled}
  >
    {children}
  </Button>
);

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

        {/* Table Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <EditorButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}><Rows size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}><Columns size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().deleteTable().run()}><Trash size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}><Merge size={16} /></EditorButton>
          <EditorButton onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}><Split size={16} /></EditorButton>
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
