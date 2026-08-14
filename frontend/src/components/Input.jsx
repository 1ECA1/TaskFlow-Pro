function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg
                   outline-none transition duration-200
                   focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500
                   placeholder:text-gray-400"
      />
    </div>
  );
}

export default Input;
