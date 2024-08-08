import React from "react";

const InputField = ({ label, placeholder, name, type, value, onChange, required }) => (
    <div className=" h-fit flex flex-col gap-1 pb-3">
        <label className="" htmlFor={`${name}_field`}>{label}</label>
        <input
            className="p-2 w-auto h-10 rounded-md bg-slate-100 drop-shadow-sm"
            placeholder={placeholder}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

export default InputField;