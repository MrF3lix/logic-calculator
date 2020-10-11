export const Required = value => {
    if(!value) return 'Field is required';
    return undefined;
};

export const IsNumber = value => {
    if(isNaN(value)) return 'Value must be a number';
    return undefined;
};

export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);
