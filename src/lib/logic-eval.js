const ShuntingYard = require('./shunting-yard');

const mappedOperators = {
    '¬': ['NOT', '!'],
    '∧': ['AND', '&'],
    '∨': ['OR', '#']
};


const dec2bin = dec => {
    return (dec >>> 0).toString(2);
};

const getBinaryArrayFromDecimal = (dec, length) => {
    let rowBin = dec2bin(dec).split('');

    rowBin = rowBin.map(i => parseInt(i));

    while (rowBin.length < length) {
        rowBin.unshift(0);
    }

    return rowBin;
};

const AND = (param1, param2) => {
    let truth = [
        [0, 0],
        [0, 1]
    ];

    return truth[param1][param2];
};

const OR = (param1, param2) => {
    let truth = [
        [0, 1],
        [1, 1]
    ];

    return truth[param1][param2];
};

const NOT = param1 => {
    let truth = [
        1,
        0
    ];

    return truth[param1];
};

const evalExpression = (params, operator) => {
    switch (operator) {
        case '∧':
            return AND(params[0], params[1]);
        case '∨':
            return OR(params[0], params[1]);
        case '¬':
            return NOT(params[0]);
        case '→':
            return OR(NOT(params[0]), params[1]);
        case '↔':
            return AND(OR(NOT(params[0]), params[1]), OR(NOT(params[1]), params[0]));
        default:
            return params[0];
    }
};

const getValueFromVariable = (stackVariable, values) => {
    if (Object.keys(values).find(k => k == stackVariable)) {
        return values[stackVariable];
    } else {
        return stackVariable;
    }
};

const parseRPN = (string, values) => {
    let stack = [];
    for (let k = 0; k < string.length; k++) {
        const ch = string[k];

        if (ch.match(/\w/) || ch.match(/\d/)) {
            stack.push(ch);
        }

        else if (ch in ShuntingYard.operators) {
            if (ch == '¬') {
                let first = stack.pop();

                let value = getValueFromVariable(first, values);
                let result = evalExpression([value], ch);

                stack.push(result);
            } else {
                let second = stack.pop();
                let first = stack.pop();

                let value1 = getValueFromVariable(first, values);
                let value2 = getValueFromVariable(second, values);

                let result = evalExpression([value1, value2], ch);
                stack.push(result);
            }
        }
    }

    return stack[0];
};

const exchangeAlternativeOperators = expression => {
    const operators = Object.keys(mappedOperators);

    operators.forEach(operator => {
        const alternativeOperators = mappedOperators[operator];
        alternativeOperators.forEach(ao => {
            expression = expression.replaceAll(ao, operator);
        });
    });

    return expression;
};

//BUG with expression is only one variable
export const getTruthTable = expression => {

    expression = exchangeAlternativeOperators(expression);
    const rpn = ShuntingYard.execute(expression);

    // Get variables from RPN
    const variables = [];
    rpn.forEach(i => {
        const operatorsList = Object.keys(ShuntingYard.operators);
        if (operatorsList.find(o => o === i)) {
            return;
        }
        if (!variables.find(v => v == i)) {
            variables.push(i);
        }
    });

    if (variables.length > 6) {
        throw (`Expressions with ${variables.length} variables are not allowed. Max 6 variables.`);
    }

    const truthTable = [];

    const headerRow = [...variables, expression];
    truthTable.push(headerRow);

    const amountRows = Math.pow(2, variables.length);
    for (let row = 0; row < amountRows; row++) {
        let rowAsBinary = getBinaryArrayFromDecimal(row, variables.length);

        let values = {};

        for (let i = 0; i < rowAsBinary.length; i++) {
            values[variables[i]] = rowAsBinary[i];
        }

        let result = parseRPN(rpn, values);
        rowAsBinary.push(result);

        truthTable.push(rowAsBinary);
    }


    return truthTable;
};

export const getDNF = truthTable => {
    const headerRow = truthTable[0];
    const dnfRows = truthTable.filter(i => i[i.length - 1] === 1);

    const dnfResult = dnfRows.map(r => {
        const rows = [...r];
        rows.pop();
        const rowResult = rows.map((element, i) => {
            if (element === 0) {
                return `¬${headerRow[i]}`;
            }
            if (element === 1) {
                return `${headerRow[i]}`;
            }
        });

        return `(${rowResult.join('∧')})`;
    });

    return dnfResult.join('∨');
};

export const getKNF = truthTable => {
    const headerRow = truthTable[0];
    const knfRows = truthTable.filter(i => i[i.length - 1] === 0);

    const knfResult = knfRows.map(r => {
        const rows = [...r];
        rows.pop();

        const rowResult = rows.map((element, i) => {
            if (element === 0) {
                return `¬${headerRow[i]}`;
            }
            if (element === 1) {
                return `${headerRow[i]}`;
            }
        });

        return `(${rowResult.join('∨')})`;
    });

    return knfResult.join('∧');
};
