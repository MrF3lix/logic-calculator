import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Form, Field, FormSpy } from 'react-final-form';
import { InputText } from './shared/forms/InputText';
import { TruthTable } from './TruthTable';

import { getDNF, getKNF, getTruthTable } from './lib/logic-eval';

export const LogicCalculator = () => {
    const [isInputExpression, setIsInputExpression] = useState(true);
    const [truthTable, setTruthTable] = useState();
    const [dnf, setDnf] = useState();
    const [knf, setKnf] = useState();

    const saveTruthTableAndGetNormalForm = tt => {

        const dnf = getDNF([...tt]);
        const knf = getKNF([...tt]);

        setDnf(dnf);
        setKnf(knf);

        setTruthTable(tt);
    };


    const createTruthTable = values => {
        try {
            const tt = getTruthTable(values.expression);
            saveTruthTableAndGetNormalForm([...tt]);
        } catch (e) {
            return { expression: `${e}` };
        }
    };

    const createExpression = values => {
        try {
            const tt = JSON.parse(values.truthTable);
            if (!Array.isArray(tt) || tt.length < 2) return;

            saveTruthTableAndGetNormalForm([...tt]);
        } catch (e) {
            return { truthTable: `${e}` };
        }


    };

    const onSubmit = values => {
        if (values && values.expression) {
            createTruthTable(values);
        }
        else if (values && values.truthTable) {
            createExpression(values);
        }
        else {
            setTruthTable(null);
            setDnf(null);
            setKnf(null);

            return;
        }
    };

    useEffect(() => {
        if (!Array.isArray(truthTable) || truthTable.length < 2) return;
        const dnf = getDNF([...truthTable]);
        const knf = getKNF([...truthTable]);

        setDnf(dnf);
        setKnf(knf);


    }, [truthTable]);

    return (
        <>
            <div className="toggel">
                <div onClick={() => setIsInputExpression(true)} className={classnames('toggel__item', { ' toggel__item--selected': isInputExpression })}>Logic Expression</div>
                <div onClick={() => setIsInputExpression(false)} className={classnames('toggel__item', { ' toggel__item--selected': !isInputExpression })}>Truth Table</div>
            </div>
            {isInputExpression ?
                <Form
                    onSubmit={onSubmit}
                    subscription={{
                        values: true
                    }}
                    render={({ handleSubmit, submitting, form }) => (
                        <form onSubmit={handleSubmit}>
                            <FormSpy subscription={{ values: true }} onChange={handleSubmit} />
                            <div className="input__container">
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
                :
                <TruthTable setTruthTable={setTruthTable} />
            }
            <hr />
            <div className="result">
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


                {truthTable && isInputExpression &&
                    <>
                        <h3>Truth Table</h3>
                        <table>
                            <tbody>
                                {truthTable.map((row, i) => {
                                    return (
                                        <tr key={i}>
                                            {row.map((cell, n) => (
                                                <React.Fragment key={i + n}>
                                                    {i === 0 ?
                                                        <th>{cell}</th>
                                                        :
                                                        <td className={classnames({
                                                            'false': cell == 0,
                                                            'true': cell == 1,
                                                        })} >{cell}</td>
                                                    }
                                                </React.Fragment >
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