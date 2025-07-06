// FroalaEditor.jsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import with better error handling
const FroalaEditorComponent = dynamic(
  () => import("react-froala-wysiwyg").catch(err => {
    console.error("Failed to load Froala Editor:", err);
    return () => <div>Editor failed to load</div>;
  }),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading editor...</div>
  }
);

let stylesLoaded = false;

export default function FroalaEditor({ content, onChange }) {
  const [model, setModel] = useState(content || "");
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (!stylesLoaded && typeof window !== "undefined") {
      try {
        // Load Froala scripts
        require("froala-editor/js/froala_editor.pkgd.min.js");
        require("froala-editor/js/plugins/align.min.js");
        require("froala-editor/js/plugins/code_view.min.js");
        require("froala-editor/js/plugins/colors.min.js");
        require("froala-editor/js/plugins/font_size.min.js");
        require("froala-editor/js/plugins/font_family.min.js");
        require("froala-editor/js/plugins/paragraph_style.min.js");
        require("froala-editor/js/plugins/table.min.js");
        require("froala-editor/js/plugins/image.min.js");
        require("froala-editor/js/plugins/link.min.js");
        require("froala-editor/js/plugins/fullscreen.min.js");
        require("froala-editor/js/plugins/lists.min.js");
        require("froala-editor/js/plugins/paragraph_format.min.js");

        // Load Froala styles
        require("froala-editor/css/froala_editor.pkgd.min.css");
        require("froala-editor/css/froala_style.min.css");
        require("froala-editor/css/themes/dark.min.css");
        require("font-awesome/css/font-awesome.css");

        stylesLoaded = true;
        setEditorReady(true);
      } catch (error) {
        console.error("Failed to load Froala resources:", error);
      }
    } else if (stylesLoaded) {
      setEditorReady(true);
    }
  }, []);

  // useEffect(() => {
  //   if (content !== model) {
  //     setModel(content || "");
  //   }
  // }, [content]);

  const handleModelChange = (newContent) => {
    setModel(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const config = {
    theme: "dark",
    heightMin: 400,
    heightMax: 800,
    placeholderText: "Start typing...",
    charCounterCount: true,
    toolbarSticky: true,
    imageUpload: true,
    imageUploadURL: "/api/upload",
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif", "webp"],
    imageMaxSize: 5 * 1024 * 1024, // 5MB
    
    // Enhanced z-index settings to fix toolbar visibility
    zIndex: 1000,
    imageInlineToolbarInside: false,
    
    events: {
      "image.inserted": function () {
        this.events.focus(true);
        const images = this.$el.find("img.fr-dii, img.fr-dib");
        if (images.length > 0) {
          this.selection.setAtStart(images.last()[0]);
          this.selection.restore();
        }
      },
      "image.uploaded": function (response) {
        try {
          const json = JSON.parse(response);
          if (json.url) {
            this.image.insert(json.url, null, null, this.image.get());
          }
        } catch (err) {
          console.error("Image upload parse error:", err);
        }
        return false;
      },
      "image.error": function (error, response) {
        console.error("Image upload error:", error, response);
      },
      "image.focused": function ($img) {
        // Force toolbar to be visible with higher z-index
        setTimeout(() => {
          const toolbar = this.$tb;
          if (toolbar) {
            toolbar.css('z-index', '10000');
          }
          // Also fix inline toolbar z-index
          const inlineToolbar = this.$box.find('.fr-toolbar.fr-inline');
          if (inlineToolbar.length) {
            inlineToolbar.css('z-index', '10000');
          }
        }, 100);
        this.toolbar.showInline();
      },
      "initialized": function () {
        console.log("Froala Editor initialized");
        
        // Add custom CSS for better toolbar visibility
        const style = document.createElement('style');
        style.textContent = `
          .fr-toolbar.fr-inline {
            z-index: 10000 !important;
            position: relative !important;
          }
          .fr-popup {
            z-index: 10001 !important;
          }
          .fr-image-resizer {
            z-index: 9999 !important;
          }
          /* Enhanced table resizing */
          .fr-table-resizer {
            background: #1976d2 !important;
            cursor: col-resize !important;
          }
          .fr-table-resizer.fr-horizontal {
            cursor: row-resize !important;
          }
          /* Better cell selection visibility */
          .fr-selected-cell {
            background-color: rgba(25, 118, 210, 0.1) !important;
            border: 2px solid #1976d2 !important;
          }
        `;
        document.head.appendChild(style);
      },
      "table.inserted": function () {
        // Table resizing is handled automatically by tableResizer config
        console.log("Table inserted with resizing enabled");
      }
    },
    
    htmlAllowTags: [
      "a", "img", "p", "div", "span", "br", "strong", "em", "u", "s", 
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", 
      "thead", "tbody", "tr", "td", "th", "blockquote", "hr"
    ],
    htmlAllowedAttrs: [
      "href", "src", "alt", "style", "class", "width", "height", 
      "target", "title", "data-*", "id", "colspan", "rowspan"
    ],
    
    // Enhanced image settings
    imageDefaultAlign: "center",
    imageDefaultDisplay: "block",
    imageResizeWithPercent: true,
    imageMultipleStyles: false,
    imageEditButtons: [
      "imageReplace", "imageAlign", "imageRemove",
      "|", "imageLink", "linkOpen", "linkEdit", "linkRemove",
      "-", "imageDisplay", "imageStyle", "imageAlt", "imageSize"
    ],
    
    // Enhanced table settings with resizing and cell background
    tableStyles: {
      'fr-table-borders': 'Borders',
      'fr-table-gray-1': 'Gray 1',
      'fr-table-gray-2': 'Gray 2',
      'fr-table-red-1': 'Red 1',
      'fr-table-red-2': 'Red 2',
      'fr-table-blue-1': 'Blue 1',
      'fr-table-blue-2': 'Blue 2'
    },
    tableCellStyles: {
      'fr-highlighted': 'Highlighted',
      'fr-thick-border': 'Thick Border'
    },
    tableColorsButtons: [
      'tableColorRemove', '|',
      'tableColorRed', 'tableColorOrange', 'tableColorYellow', 'tableColorGreen',
      'tableColorBlue', 'tableColorGray', '|',
      'tableColorPurple', 'tableColorPink', 'tableColorCyan'
    ],
    tableEditButtons: [
      "tableHeader", "tableRemove",
      "|", "tableRows", "tableColumns",
      "|", "tableCellBackground", "tableCellVerticalAlign", "tableCellHorizontalAlign",
      "|", "tableCellStyle", "tableStyle"
    ],
    tableResizer: true,
    tableResizerOffset: 5,
    tableResizingLimit: 30,
    
    toolbarButtons: [
      "bold", "italic", "underline", "strikeThrough", "subscript", "superscript",
      "|", "fontFamily", "fontSize", "textColor", "backgroundColor", "clearFormatting",
      "|", "paragraphFormat", "paragraphStyle", "quote",
      "|", "alignLeft", "alignCenter", "alignRight", "alignJustify",
      "|", "formatOL", "formatUL", "insertHR",
      "|", "insertLink", "insertImage", "insertTable",
      "|", "undo", "redo", "fullscreen", "html"
    ],
    toolbarButtonsXS: [
      "bold", "italic", "underline", "|", "alignLeft", "alignCenter", "alignRight", 
      "|", "insertLink", "insertImage", "|", "undo", "redo"
    ],
    toolbarButtonsSM: [
      "bold", "italic", "underline", "strikeThrough", "|", "fontFamily", "fontSize", 
      "|", "alignLeft", "alignCenter", "alignRight", "|", "formatOL", "formatUL", 
      "|", "insertLink", "insertImage", "insertTable", "|", "undo", "redo", "fullscreen"
    ],
    toolbarButtonsMD: "toolbarButtons",
  };

  if (!editorReady) {
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
    <div className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[500px] relative">
      <FroalaEditorComponent
        tag="textarea"
        model={model}
        onModelChange={handleModelChange}
        config={config}
      />
    </div>
  );
}