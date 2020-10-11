import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { getBinaryArrayFromDecimal } from './lib/binary';

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

export const TruthTable = ({ setTruthTable }) => {
    const [amountVariables, setAmountVariables] = useState(2);
    const [inputTable, setInputTable] = useState();
    const [truthTableHeader, setTruthTableHeader] = useState();
    const [results, setResults] = useState([0, 0]);


    useEffect(() => {
        if (!inputTable) return;

        const table = [];

        table.push([...truthTableHeader, 'Result']);

        inputTable.forEach((value, i) => {
            table.push([...value, results[i]]);
        });

        setTruthTable(table);

    }, [amountVariables, results]);


    useEffect(() => {
        const amountRows = Math.pow(2, amountVariables);
        const tempResult = [];
        const table = [];
        const header = [];

        for (let i = 0; i < amountRows; i++) {
            const binary = getBinaryArrayFromDecimal(i, amountVariables);

            table.push(binary);

            if (results[i] !== undefined) {
                tempResult.push(results[i]);
            } else {
                tempResult.push(0);
            }

        }

        for (let i = 0; i < amountVariables; i++) {
            header.push(alphabet[i]);
        }

        setInputTable(table);
        setTruthTableHeader(header);
        setResults(tempResult);

    }, [amountVariables]);

    const addVariable = () => {
        if (amountVariables >= 6) {
            return;
        }

        setAmountVariables(amountVariables + 1);
    };

    const changeResult = (i, value) => {
        results[i] = parseInt(value);
        setResults([...results]);
    };

    return (
        <div className="truth-table__input">
            <table>
                <thead>
                    <tr>
                        {truthTableHeader && truthTableHeader.map((cell, i) => (
                            <th key={`th-${i}`}>{cell}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {inputTable && inputTable.map((row, i) => (
                        <tr key={`tr-${i}`}>
                            {row.map((cell, n) => (
                                <td
                                    className={classnames({
                                        'false': cell == 0,
                                        'true': cell == 1
                                    })}
                                    key={`td-${n}`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {amountVariables <= 6 &&
                <button onClick={addVariable}>+</button>
            }

            <table>
                <thead>
                    <tr>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {results && results.map((result, i) => (
                        <tr key={`results-${i}`}>
                            <td
                                className={classnames('td--result', {
                                    'false': result == 0,
                                    'true': result == 1
                                })}
                            >
                                <label htmlFor={`input-${i}`}>
                                    {result}
                                </label>
                                <input id={`input-${i}`} type="checkbox" checked={result === 1} onChange={() => changeResult(i, result === 1 ? 0 : 1)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};