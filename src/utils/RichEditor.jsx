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
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  PaintBucket,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Minus,
  TableIcon,
  Rows,
  Columns,
  Trash,
  Merge,
  Split,
  CornerDownLeft,
  CornerDownRight,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  TableRowsSplit,
  TableColumnsSplitIcon
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
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize }) // apply to textStyle
            .run(),
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
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
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
          renderHTML: (attrs) =>
            attrs.color ? { style: `color: ${attrs.color}` } : {},
        },
        backgroundColor: {
          default: null,
          parseHTML: (element) => element.style.backgroundColor || null,
          renderHTML: (attrs) =>
            attrs.backgroundColor
              ? { style: `background-color: ${attrs.backgroundColor}` }
              : {},
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
];

const EditorButton = ({ onClick, children }) => (
  <Button type="button" onClick={onClick} variant="outline">
    {children}
  </Button>
);

export function MenuBar({ editor }) {
  if (!editor) return null;

  return (
    <div className="space-y-2 p-2 border-b border-muted bg-background">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Font Size Dropdown */}
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
        >
          <option value="">Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        <label
          className="relative cursor-pointer w-8 h-8 border rounded flex items-center justify-center"
          title="Text Color"
        >
          <PaintBucket size={16} />
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        {/* Background Color Picker with Highlighter Icon */}
        <label
          className="relative cursor-pointer w-8 h-8 border rounded flex items-center justify-center"
          title="Background Color"
        >
          <Highlighter size={16} />
          <input
            type="color"
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setMark("textStyle", { backgroundColor: e.target.value })
                .run()
            }
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        {/* Styles */}
        <EditorButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={18} />
        </EditorButton>
        <EditorButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { color: null, backgroundColor: null })
              .run()
          }
        >
          <Eraser size={18} />
        </EditorButton>

        {/* Alignment */}
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={18} />
        </EditorButton>

        {/* Headings */}
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <EditorButton
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            {React.createElement(
              [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6][
                level - 1
              ],
              { size: 18 }
            )}
          </EditorButton>
        ))}

        {/* Lists & Block */}
        <EditorButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={18} />
        </EditorButton>
        <EditorButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </EditorButton>

        {/* Tables */}
        <EditorButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}><Rows size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}><Columns size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().deleteTable().run()}><Trash size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}><Merge size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}><Split size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}><  TableRowsSplit size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()}><TableColumnsSplitIcon size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setCellAttribute("backgroundColor", "#FAF594").run()} disabled={!editor.can().setCellAttribute("backgroundColor", "#FAF594")}>
          Cell BG
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}><ArrowRightFromLine size={18} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}><ArrowLeftFromLine size={18} /></EditorButton>
      

        {/* Undo/Redo */}
        <EditorButton onClick={() => editor.chain().focus().undo().run()}>
          <CornerDownLeft size={18} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().redo().run()}>
          <CornerDownRight size={18} />
        </EditorButton>
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
    <div className="space-y-4">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-full border p-4 rounded bg-white dark:bg-zinc-900 min-h-[300px]"
      />
    </div>
  );
}
