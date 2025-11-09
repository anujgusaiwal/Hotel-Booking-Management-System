export default function Input({ label, type = 'text', value, onChange, error, placeholder, required = false, className = '', min, max, step, ...otherProps }) {
  const handleKeyDown = (e) => {
    // Prevent non-numeric input for number type
    if (type === 'number') {
      // Allow: backspace, delete, tab, escape, enter, and arrow keys
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        return;
      }
      
      // Allow allowed keys
      if (allowedKeys.includes(e.key)) {
        return;
      }
      
      // Allow numbers (0-9) on both main keyboard and numpad
      if (/^[0-9]$/.test(e.key)) {
        return;
      }
      
      // Allow minus sign at the start (for negative numbers if needed)
      if (e.key === '-' && e.target.selectionStart === 0 && !e.target.value.includes('-')) {
        return;
      }
      
      // Allow decimal point only if step allows decimals (and step is not 1 or undefined)
      const allowsDecimals = step && step !== 1 && step.toString().includes('.');
      if (e.key === '.' && allowsDecimals && !e.target.value.includes('.')) {
        return;
      }
      
      // Prevent all other keys (including letters and special characters)
      e.preventDefault();
    }
  };
  
  const handleInput = (e) => {
    // Additional validation for number type
    if (type === 'number' && onChange) {
      let inputValue = e.target.value;
      
      // Allow empty value (for clearing the field)
      if (inputValue === '' || inputValue === '-') {
        onChange(e);
        return;
      }
      
      // Determine if decimals are allowed
      const allowsDecimals = step && step !== 1 && step.toString().includes('.');
      
      // Remove any non-numeric characters, and decimal point if not allowed
      if (allowsDecimals) {
        // Allow digits, one decimal point, and optional minus at start
        inputValue = inputValue.replace(/[^0-9.-]/g, '');
        // Ensure only one decimal point
        const parts = inputValue.split('.');
        if (parts.length > 2) {
          inputValue = parts[0] + '.' + parts.slice(1).join('');
        }
        // Ensure minus is only at the start
        if (inputValue.includes('-') && inputValue.indexOf('-') !== 0) {
          inputValue = inputValue.replace(/-/g, '');
        }
      } else {
        // Integer only - remove all non-numeric characters except optional minus at start
        inputValue = inputValue.replace(/[^0-9-]/g, '');
        // Ensure minus is only at the start
        if (inputValue.includes('-') && inputValue.indexOf('-') !== 0) {
          inputValue = inputValue.replace(/-/g, '');
        }
      }
      
      // Update the input value directly to ensure it reflects the cleaned value
      e.target.value = inputValue;
      
      // Create a new event-like object with the cleaned value, preserving all target properties
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: inputValue,
          name: e.target.name,
          type: e.target.type
        },
        currentTarget: {
          ...e.currentTarget,
          value: inputValue,
          name: e.target.name,
          type: e.target.type
        }
      };
      
      onChange(syntheticEvent);
    } else if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        {...otherProps}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

