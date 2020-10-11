import React, { useState } from 'react';
import classnames from 'classnames';
import { Form, Field, FormSpy } from 'react-final-form';
import { InputText } from './shared/forms/InputText';

import { getDNF, getKNF, getTruthTable } from './lib/logic-eval';

export const LogicCalculator = () => {
    const [truthTableHeader, setTruthTableHeader] = useState();
    const [truthTable, setTruthTable] = useState();
    const [dnf, setDnf] = useState();
    const [knf, setKnf] = useState();

    const onSubmit = values => {

        if (!values || !values.expression) {
            setTruthTable(null);
            setDnf(null);
            setKnf(null);

            return;
        }

        try {
            const truthTable = getTruthTable(values.expression);

            const dnf = getDNF([...truthTable]);
            const knf = getKNF([...truthTable]);

            setDnf(dnf);
            setKnf(knf);

            const header = truthTable.shift();

            setTruthTableHeader(header);
            setTruthTable(truthTable);
        } catch (e) {
            return { expression: `${e}` };
        }

    };

    return (
        <>
            <Form
                onSubmit={onSubmit}
                subscription={{
                    values: true
                }}
                initialValues={
                    { expression: 'A' }
                }
                render={({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <FormSpy subscription={{ values: true }} onChange={handleSubmit} />
                        <div className="input__container">
                            <label>Logic Expression</label>
                            <Field
                                name="expression"
                                type="text"
                                placeholder="(A ∧ B)"
                                component={InputText}
                                disabled={submitting}
                            />
                        </div>
                    </form>
                )}
            />
            <div className="result">
                <hr />
                <h2>Results</h2>

                {(dnf || knf) &&
                    <>
                        <h3>Normalized Forms</h3>

                        <table>
                            <tbody>
                                <tr>
                                    <th>DNF</th>
                                    <td>{dnf}</td>
                                </tr>
                                <tr>
                                    <th>CNF</th>
                                    <td>{knf}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                }


                {truthTable &&
                    <>
                        <h3>Truth Table</h3>
                        <table>
                            <thead>
                                <tr>
                                    {truthTableHeader.map((headerCell, i) => (
                                        <th key={i}>{headerCell}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {truthTable.map((row, i) => {
                                    return (
                                        <tr key={i}>
                                            {row.map((cell, n) => (
                                                <td className={classnames({
                                                    'false': cell == 0,
                                                    'true': cell == 1
                                                })} key={i + n}>{cell}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>

                }
            </div>
        </>
    );
};