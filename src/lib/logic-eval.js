import { distinctItems } from './array';
import { getBinaryArrayFromDecimal } from './binary';

const ShuntingYard = require('./shunting-yard');

const mappedOperators = {
    '¬': ['NOT', '!'],
    '∧': ['AND', '&'],
    '∨': ['OR', '#']
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

    const result = stack[0];

    if (isNaN(result)) {
        return values[result];
    }

    return result;
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

const switchVal = val => val === 0 ? 1 : 0;

export const removeRedundantVariables = expression => {
    if (!expression) return;

    expression = exchangeAlternativeOperators(expression);
    const rpn = ShuntingYard.execute(expression);

    const truthTable = getTruthTable(expression);

    const header = truthTable[0];
    header[header.length -1] = 'Result';

    const redundantCols = [];
    for (let colIndex = 0; colIndex < header.length - 1; colIndex++) {


        const testCol = truthTable.map((row, i) => {
            if (i === 0) return;

            let values = {};

            header.forEach((h, n) => {
                if (n === colIndex) {
                    values[h] = switchVal(row[n]);

                } else {
                    values[h] = row[n];
                }
            });

            let result = parseRPN(rpn, values);
            return result === row[header.length - 1];
        });

        const isColRedundant = !testCol.some(i => i === false);
        if (isColRedundant) {
            redundantCols.push(colIndex);
        }

    }

    if(redundantCols.length === 0) return truthTable;

    const newTruthTable = truthTable.map(row => {
        const newRow = [];

        row.forEach((col, n) => {
            if (!redundantCols.some(r => r === n)) {
                newRow.push(col);
            }
        });

        return newRow;
    });

    return distinctItems(newTruthTable);
};

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
