import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  Unlink,
  TableIcon,
  Palette,
  Highlighter,
  ImageIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/utils/cn";

import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";

import { useCallback, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import {
  removeJobImage,
  uploadJobImage,
} from "@/modules/hr-module/services/jobsService";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

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
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const RichTextEditor = ({
  label,
  value = "",
  onChange,
  error,
  touched,
  placeholder,
  isRequired = false,
  className,
}) => {
  const { user } = useSelector((state) => state.auth);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer hover:text-primary/80",
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      ImageWithId.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none",
          "focus:outline-none min-h-[200px] p-4",
          "prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight",
          "prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6",
          "prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5",
          "prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-4",
          "prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4",
          "prose-h5:text-base prose-h5:mb-2 prose-h5:mt-3",
          "prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-3 prose-h6:font-semibold",
          "prose-p:text-foreground prose-p:my-2 prose-p:leading-relaxed",
          "prose-ul:text-foreground prose-ul:my-2 prose-ol:text-foreground prose-ol:my-2",
          "prose-li:text-foreground prose-li:my-1",
          "prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4",
          "prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:my-4",
          "prose-code:bg-muted prose-code:text-muted-foreground prose-code:px-1 prose-code:py-0.5",
          "prose-code:rounded prose-code:text-sm prose-code:font-mono",
          "prose-strong:text-foreground prose-strong:font-bold",
          "prose-em:text-foreground prose-em:italic"
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleDelete = ({ transaction }) => {
      const oldImages = [];
      const newImages = [];

      transaction.before?.descendants?.((node) => {
        if (node.type.name === "image") {
          oldImages.push(node.attrs);
        }
      });

      transaction.doc?.descendants?.((node) => {
        if (node.type.name === "image") {
          newImages.push(node.attrs);
        }
      });

      const removedImages = oldImages.filter(
        (oldImg) => !newImages.some((newImg) => newImg.src === oldImg.src)
      );

      removedImages.forEach(async (img) => {
        const imageId = img["data-image-id"];
        if (imageId && user?.organisation_id) {
          try {
            await removeJobImage(user.organisation_id, imageId);
          } catch (err) {
            console.error("Image deletion failed:", err);
          }
        }
      });
    };

    editor.on("transaction", handleDelete);
    return () => editor.off("transaction", handleDelete);
  }, [editor, user]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file || !user?.organisation_id) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const { id, image } = await uploadJobImage(
          user.organisation_id,
          formData
        );
        editor
          ?.chain()
          .focus()
          .setImage({ src: addBaseURL(image), "data-image-id": id })
          .run();
      } catch (err) {
        console.error("Upload failed:", err);
      }
    };
    input.click();
  }, [editor, user]);

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const addRowBefore = useCallback(() => {
    editor?.chain().focus().addRowBefore().run();
  }, [editor]);

  const addRowAfter = useCallback(() => {
    editor?.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor?.chain().focus().deleteRow().run();
  }, [editor]);

  const addColumnBefore = useCallback(() => {
    editor?.chain().focus().addColumnBefore().run();
  }, [editor]);

  const addColumnAfter = useCallback(() => {
    editor?.chain().focus().addColumnAfter().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor?.chain().focus().deleteColumn().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor?.chain().focus().deleteTable().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }) => {
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };

    const handleMouseDown = (e) => {
      e.preventDefault(); // Prevent focus loss
    };

    const buttonClass = cn(
      "inline-flex items-center justify-center h-8 w-8 p-0 rounded-sm border transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      isActive
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
    );

    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        disabled={disabled}
        title={title}
        className={buttonClass}
      >
        {children}
      </button>
    );
  };

  const ColorPicker = ({ type }) => {
    const colors = [
      "#000000",
      "#374151",
      "#6B7280",
      "#9CA3AF",
      "#EF4444",
      "#F97316",
      "#EAB308",
      "#22C55E",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
      "#F43F5E",
    ];

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
          >
            {type === "color" ? (
              <Palette className="h-4 w-4" />
            ) : (
              <Highlighter className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  if (type === "color") {
                    editor.chain().focus().setColor(color).run();
                  } else {
                    editor.chain().focus().setHighlight({ color }).run();
                  }
                }}
              />
            ))}
          </div>
          <Separator className="my-2" />
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => {
              if (type === "color") {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().unsetHighlight().run();
              }
            }}
          >
            Remove {type === "color" ? "Color" : "Highlight"}
          </Button>
        </PopoverContent>
      </Popover>
    );
  };

  const FontSizeSelector = () => {
    const fontSizes = [
      { label: "10px", value: "10px" },
      { label: "12px", value: "12px" },
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "18px", value: "18px" },
      { label: "20px", value: "20px" },
      { label: "24px", value: "24px" },
      { label: "28px", value: "28px" },
      { label: "32px", value: "32px" },
      { label: "36px", value: "36px" },
      { label: "48px", value: "48px" },
    ];

    // Force re-render when editor state changes
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => forceUpdate();
      editor.on("selectionUpdate", handleUpdate);
      editor.on("transaction", handleUpdate);

      return () => {
        editor.off("selectionUpdate", handleUpdate);
        editor.off("transaction", handleUpdate);
      };
    }, []);

    // Get current font size
    const currentFontSize = editor?.getAttributes("textStyle")?.fontSize || "";

    const handleValueChange = (value) => {
      if (value === "default") {
        editor.chain().focus().unsetFontSize().run();
      } else {
        editor.chain().focus().setFontSize(value).run();
      }
    };

    return (
      <Select value={currentFontSize} onValueChange={handleValueChange}>
        <SelectTrigger
          className="w-20 h-8 text-xs"
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
        >
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "border rounded-lg overflow-hidden bg-background",
          error && touched ? "border-destructive" : "border-border",
          "focus-within:border-ring"
        )}
      >
        {/* Toolbar */}
        <div className="border-b bg-muted/30 p-1.5 flex flex-wrap gap-0.5 leading-none">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Code"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Colors and Font Size */}
          <div className="flex gap-1">
            <ColorPicker type="color" />
            <ColorPicker type="highlight" />
            <FontSizeSelector />
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Headings */}
          <div className="flex gap-1">
            <Select
              value={
                editor.isActive("heading", { level: 1 })
                  ? "h1"
                  : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : editor.isActive("heading", { level: 4 })
                  ? "h4"
                  : editor.isActive("heading", { level: 5 })
                  ? "h5"
                  : editor.isActive("heading", { level: 6 })
                  ? "h6"
                  : "paragraph"
              }
              onValueChange={(value) => {
                if (value === "paragraph") {
                  editor.chain().focus().setParagraph().run();
                } else {
                  const level = Number.parseInt(value.replace("h", ""));
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">P</SelectItem>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Alignment */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Lists */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Links and Media */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive("link")}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
              title="Remove Link"
            >
              <Unlink className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Upload Image">
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="Insert Table">
              <TableIcon className="h-4 w-4" />
            </ToolbarButton>

            {/* Table Controls - Show only when cursor is in a table */}
            {editor.isActive("table") && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent"
                      >
                        Table
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={addRowBefore}
                        >
                          Add Row Before
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={addRowAfter}
                        >
                          Add Row After
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={deleteRow}
                        >
                          Delete Row
                        </Button>
                        <Separator className="my-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={addColumnBefore}
                        >
                          Add Column Before
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={addColumnAfter}
                        >
                          Add Column After
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={deleteColumn}
                        >
                          Delete Column
                        </Button>
                        <Separator className="my-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={deleteTable}
                        >
                          Delete Table
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor Content */}
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
          <EditorContent
            editor={editor}
            placeholder={placeholder}
            className="focus:outline-none"
          />
        </div>
      </div>

      {error && touched && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default RichTextEditor;

import Image from "@tiptap/extension-image";
import { addBaseURL } from "@/utils/addBaseUrl";

const ImageWithId = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-image-id": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-image-id"),
        renderHTML: (attributes) => {
          if (!attributes["data-image-id"]) {
            return {};
          }
          return {
            "data-image-id": attributes["data-image-id"],
          };
        },
      },
    };
  },
});
