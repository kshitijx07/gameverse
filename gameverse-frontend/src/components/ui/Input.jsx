import React, { useState } from 'react';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    className = '',
    ...props
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${focused || value ? '-top-2 text-xs bg-dark-900 px-2 text-neon-cyan' : 'top-3 text-gray-400'}
        `}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? placeholder : ''}
                className={`
          w-full px-4 py-3 bg-dark-800 border-2 rounded-lg
          text-white placeholder-gray-500 outline-none
          transition-all duration-300
          ${error ? 'border-red-500' : focused ? 'border-neon-cyan shadow-neon' : 'border-gray-700'}
          ${label ? 'pt-6 pb-2' : ''}
        `}
                {...props}
            />
            {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
