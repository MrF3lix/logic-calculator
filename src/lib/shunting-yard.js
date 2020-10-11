/**
 * Shunting yard algorithm
 * See: http://en.wikipedia.org/wiki/Shunting_yard_algorithm
 *
 * Converts infix notation to postfix notation
 *
 * by Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 * MIT Style License
 *
 * (C) 2011, updated on 2020
 * 
 * 04.10.2020: Extended by Felix Saaro <felix@saaro> to work with logic operators
 * 
 */


Array.prototype.peek = function () {
    return this[this.length - 1];
};

// operators set
const operators = {
    '¬': 1,
    '∧': 1,
    '∨': 1,
    '→': 1,
    '↔': 1,
};

// associations (left / right) sets
const leftAssoc = { '∧': 1, '∨': 1, '→': 1, '↔': 1 };
const rightAssoc = { '¬': 1 };

/**
 * precedenceOf
 *
 * precedence   operators       associativity
 * 1            ¬               right to left
 * 2            ∧               left to right
 * 3            ∧               left to right
 */
const precedenceOf = {
    '¬': 4,

    '∧': 3,

    '∨': 2,

    '→': 1,
    '↔': 1,
};

const execute = (string) => {
    let output = [];
    let stack = [];

    for (let k = 0; k < string.length; k++) {
        const ch = string[k];
        if (ch === ' ') {
            continue;
        }

        if (ch.match(/\w/)) {
            output.push(ch);
        }

        else if (ch in operators) {
            const op1 = ch;

            while (stack.length > 0) {
                const op2 = stack.peek();

                if (op2 in operators && (
                    // and op1 is left-associative and its precedence is less than or equal to that of op2,
                    (op1 in leftAssoc && (precedenceOf[op1] <= precedenceOf[op2])) ||
                    // or op1 is right-associative and its precedence is less than that of op2,
                    (op1 in rightAssoc && (precedenceOf[op1] < precedenceOf[op2]))
                )) {
                    // push op2 onto the output queue
                    output.push(stack.pop());

                } else {
                    break;
                }

            }
            stack.push(op1);
        }

        else if (ch === '(') {
            stack.push(ch);
        }

        else if (ch === ')') {
            let foundLeftParen = false;

            // until the token at the top of the stack is a left parenthesis,
            // pop operators off the stack onto the output queue
            while (stack.length > 0) {
                const c = stack.pop();
                if (c === '(') {
                    foundLeftParen = true;
                    break;
                } else {
                    output.push(c);
                }
            }

            // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
            if (!foundLeftParen) {
                throw new Error('Parentheses mismatched');
            }
        }

        else {
            throw new Error(`Unknown token: ${ch}`);
        }

    }

    // when there are no more tokens to read:
    // while there are still operator tokens in the stack:
    while (stack.length > 0) {

        const c = stack.pop();

        if (c === '(' || c === ')') {
            throw new Error('Parentheses mismatched');
        }

        output.push(c);

    }

    return output;

};

module.exports = {
    execute,
    operators
};