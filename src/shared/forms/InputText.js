import React from 'react';
import classNames from 'classnames';

export const InputText = ({ input, meta, placeholder, disabled = false }) => {
    const hasError = (meta.error || meta.submitError) && meta.touched;
    
    return (
        <>
            <input
                className={classNames({
                    'input--error': hasError
                })}
                type="text"
                placeholder={placeholder}
                disabled={disabled}
                {...input}
            />
            {hasError &&
                <span className="error__message">{meta.error || meta.submitError}</span>
            }
        </>
    );
};