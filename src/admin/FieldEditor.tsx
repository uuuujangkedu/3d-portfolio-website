import { useState } from "react";
import type { Field } from "../data/schema";
import ImageCropper from "./ImageCropper";

type Props = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
};

// Every branch spreads the previous value, so keys missing from the schema
// survive a round trip instead of being dropped on save.
export const FieldEditor = ({ field, value, onChange }: Props) => {
  if (field.type === "group") {
    const group = (value ?? {}) as Record<string, unknown>;
    return (
      <fieldset className="ad-fieldset">
        <legend>{field.label}</legend>
        {field.fields?.map((child) => (
          <FieldEditor
            key={child.key}
            field={child}
            value={group[child.key]}
            onChange={(next) => onChange({ ...group, [child.key]: next })}
          />
        ))}
      </fieldset>
    );
  }

  if (field.type === "list") {
    const items = (value ?? []) as Record<string, unknown>[];
    const update = (index: number, next: Record<string, unknown>) =>
      onChange(items.map((item, i) => (i === index ? next : item)));
    const move = (from: number, to: number) => {
      if (to < 0 || to >= items.length) return;
      const next = [...items];
      [next[from], next[to]] = [next[to], next[from]];
      onChange(next);
    };

    return (
      <fieldset className="ad-fieldset">
        <legend>
          {field.label} <span className="ad-count">{items.length}</span>
        </legend>
        {items.map((item, index) => (
          <div className="ad-item" key={index}>
            <div className="ad-item-head">
              <strong>{String(item[field.fields?.[0]?.key ?? ""] ?? index + 1)}</strong>
              <span>
                <button type="button" onClick={() => move(index, index - 1)}>
                  ↑
                </button>
                <button type="button" onClick={() => move(index, index + 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  className="ad-danger"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  Hapus
                </button>
              </span>
            </div>
            {field.fields?.map((child) => (
              <FieldEditor
                key={child.key}
                field={child}
                value={item[child.key]}
                onChange={(next) => update(index, { ...item, [child.key]: next })}
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([...items, structuredClone(items[items.length - 1] ?? {})])
          }
        >
          + Tambah
        </button>
      </fieldset>
    );
  }

  if (field.type === "strings" || field.type === "imageList") {
    const list = (value ?? []) as string[];
    const isImage = field.type === "imageList";
    return (
      <fieldset className="ad-fieldset">
        <legend>{field.label}</legend>
        {list.map((entry, index) => (
          <div className="ad-row" key={index}>
            {isImage ? (
              <ImageField
                field={{ key: "", label: "", type: "image" }}
                value={entry}
                onChange={(next) =>
                  onChange(list.map((v, i) => (i === index ? String(next) : v)))
                }
              />
            ) : (
              <input
                value={entry}
                onChange={(e) =>
                  onChange(list.map((v, i) => (i === index ? e.target.value : v)))
                }
              />
            )}
            <button
              type="button"
              className="ad-danger"
              onClick={() => onChange(list.filter((_, i) => i !== index))}
            >
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...list, ""])}>
          + Tambah
        </button>
      </fieldset>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="ad-field">
        <span>{field.label}</span>
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="ad-field ad-check">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="ad-field">
        <span>{field.label}</span>
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "image") {
    return <ImageField field={field} value={value} onChange={onChange} />;
  }

  return (
    <label className="ad-field">
      <span>{field.label}</span>
      <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
};

const ImageField = ({ field, value, onChange }: Props) => {
  const [draft, setDraft] = useState<File | null>(null);

  if (draft) {
    return (
      <ImageCropper
        file={draft}
        onCancel={() => setDraft(null)}
        onDone={(url) => {
          setDraft(null);
          onChange(url);
        }}
      />
    );
  }

  return (
    <div className="ad-field">
      <span>{field.label}</span>
      <div className="ad-row">
        <input
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/namafile.jpg atau https://…"
        />
        <label className="ad-upload">
          Upload
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) setDraft(file);
            }}
          />
        </label>
        {value ? (
          <button type="button" className="ad-danger" onClick={() => onChange("")}>
            Hapus
          </button>
        ) : null}
      </div>
      {value ? <img className="ad-preview" src={String(value)} alt="" /> : null}
    </div>
  );
};
