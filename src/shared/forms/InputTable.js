import React from 'react';
import classNames from 'classnames';

export const InputTable = ({ input, meta, placeholder, disabled }) => {
    const hasError = (meta.error || meta.submitError) && meta.touched;

    return (
        <>
            <textarea
                className={classNames({
                    'input--error': hasError
                })}
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