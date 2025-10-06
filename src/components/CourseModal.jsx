import { useState, useEffect } from "react";

// input components

const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}) => (
  <div className="flex flex-col">
    <p>{label}</p>
    <input
      name={name}
      value={value ?? ""}
      onChange={onChange}
      type={type}
      className="border p-2 rounded"
      required={required}
    />
  </div>
);

const TextareaInput = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="flex flex-col">
    <p>{label}</p>
    <textarea
      name={name}
      value={value ?? ""}
      onChange={onChange}
      rows={rows}
      className="border p-2 rounded"
    />
  </div>
);

const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <div className="flex flex-col">
    <p>{label}</p>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="border p-2 rounded"
      required={required}
    >
      <option value="">-- Pilih {label} --</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// FIXED FileInput component

const FileInput = ({
  label,
  field,
  value,
  mode,
  setMode,
  onChangeFile,
  onChangeURL,
  previewClass,
}) => (
  <div className="flex flex-col mb-2">
    <p>{label}</p>

    {/* Switch Mode */}
    <div className="flex gap-4 mb-2">
      <label>
        <input
          type="radio"
          checked={mode === "url"}
          onChange={() => {
            setMode("url");
            onChangeURL({ target: { name: field, value: "" } }); // reset value
          }}
        />{" "}
        URL
      </label>
      <label>
        <input
          type="radio"
          checked={mode === "upload"}
          onChange={() => {
            setMode("upload");
            onChangeURL({ target: { name: field, value: "" } });
          }}
        />{" "}
        Upload
      </label>
    </div>

    {/* Input field */}
    {mode === "url" ? (
      <input
        name={field}
        value={value ?? ""}
        onChange={onChangeURL}
        className="border p-2 rounded"
        placeholder={`${label} URL`}
      />
    ) : (
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChangeFile(e, field)}
        className="border p-2 rounded"
      />
    )}

    {/* Preview */}
    {value && (
      <img
        src={value}
        alt="preview"
        className={`${previewClass} mt-2 rounded`}
      />
    )}
  </div>
);

// Main CourseModal

function CourseModal({ isOpen, onClose, onSave, initialData }) {
  const defaultForm = {
    image: "",
    title: "",
    desc: "",
    avatar: "",
    instructor: "",
    role: "",
    company: "",
    rating: 0,
    reviews: 0,
    price: "",
    category: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [fileMode, setFileMode] = useState({ image: "url", avatar: "url" });
  const [displayPrice, setDisplayPrice] = useState("");

  const categories = ["desain", "pengembangan", "bisnis", "pemasaran"];

  // Reset form modal dibuka
  useEffect(() => {
    if (initialData) {
      setForm({
        image: initialData.image || "",
        title: initialData.title || "",
        desc: initialData.desc || "",
        avatar: initialData.avatar || "",
        instructor: initialData.instructor || "",
        role: initialData.role || "",
        company: initialData.company || "",
        rating: initialData.rating ?? 0,
        reviews: initialData.reviews ?? 0,
        price: initialData.price ?? "",
        category: initialData.category || "",
      });
      setDisplayPrice(formatPrice(initialData.price || 0));
    } else {
      setForm(defaultForm);
      setDisplayPrice("");
    }
  }, [initialData, isOpen]);

  // Format price helper
  const formatPrice = (value) => {
    if (!value) return "";
    const num = Number(value);
    if (num >= 1000) return "Rp " + (num / 1000).toFixed(0) + "k";
    return "Rp " + num;
  };

  // Handle text/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input safely
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Update Course" : "Create Course"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2"
        >
          <TextInput
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <TextareaInput
            label="Description"
            name="desc"
            value={form.desc}
            onChange={handleChange}
          />

          <SelectInput
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={categories}
            required
          />

          {/* Image */}
          <FileInput
            label="Image"
            field="image"
            value={form.image}
            mode={fileMode.image}
            setMode={(m) => setFileMode((prev) => ({ ...prev, image: m }))}
            onChangeFile={handleFileChange}
            onChangeURL={handleChange}
            previewClass="w-32 h-20 object-cover"
          />

          {/* Avatar */}
          <FileInput
            label="Avatar"
            field="avatar"
            value={form.avatar}
            mode={fileMode.avatar}
            setMode={(m) => setFileMode((prev) => ({ ...prev, avatar: m }))}
            onChangeFile={handleFileChange}
            onChangeURL={handleChange}
            previewClass="w-16 h-16 object-cover rounded-full"
          />

          <TextInput
            label="Instructor"
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
          />
          <TextInput
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
          />
          <TextInput
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
          />

          {/* Rating */}
          <div className="flex flex-col">
            <p>Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    star <= Math.round(form.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                >
                  ★
                </span>
              ))}
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={form.rating ?? 0}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val > 5) val = 5;
                  if (val < 0) val = 0;
                  setForm((prev) => ({ ...prev, rating: val }));
                }}
                className="border p-1 rounded w-16 text-center"
              />
            </div>
          </div>

          <TextInput
            label="Reviews (jumlah reviewer)"
            name="reviews"
            type="number"
            value={form.reviews}
            onChange={handleChange}
          />

          {/* Price */}
          <div className="flex flex-col">
            <p className="mb-1 font-medium">Price (dalam Rp)</p>
            <div className="flex items-center border rounded overflow-hidden">
              <span className="bg-gray-100 px-3 text-gray-600">Rp</span>
              <input
                type="number"
                name="price"
                step={1000}
                value={form.price ?? ""}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  setForm((prev) => ({ ...prev, price: val }));
                  setDisplayPrice(formatPrice(val));
                }}
                className="flex-1 p-2 outline-none"
                placeholder="Masukkan harga"
              />
            </div>
            {form.price > 0 && (
              <p className="text-gray-500 mt-1">Tertulis: {displayPrice}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseModal;
