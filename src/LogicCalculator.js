import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Form, Field, FormSpy } from 'react-final-form';
import { InputText } from './shared/forms/InputText';
import { TruthTableInput } from './TruthTableInput';
import { TruthTableOutput } from './TruthTableOutput';

import { getDNF, getKNF, getTruthTable, removeRedundantVariables } from './lib/logic-eval';

export const LogicCalculator = () => {
    const [isInputExpression, setIsInputExpression] = useState(true);
    const [truthTable, setTruthTable] = useState();
    const [simpleTruthTable, setSimpleTruthTable] = useState();

    const createTruthTable = values => {
        try {
            const tt = getTruthTable(values.expression);
            const truthTableWithoutRedundantCols = removeRedundantVariables(values.expression);

            setSimpleTruthTable([...truthTableWithoutRedundantCols]);
            setTruthTable([...tt]);
        } catch (e) {
            return { expression: `${e}` };
        }
    };

    const createExpression = values => {
        try {
            const tt = JSON.parse(values.truthTable);
            if (!Array.isArray(tt) || tt.length < 2) return;

            setTruthTable([...tt]);
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

            return;
        }
    };

    useEffect(() => {
        if (!Array.isArray(truthTable) || truthTable.length < 2) return;


        const dnf = getDNF([...truthTable]);
        const knf = getKNF([...truthTable]);

        const truthTableWithoutRedundantCols = removeRedundantVariables(dnf || knf);
        setSimpleTruthTable([...truthTableWithoutRedundantCols]);

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
                <TruthTableInput setTruthTable={setTruthTable} />
            }
            <hr />
            <div className="result">

                {truthTable &&
                    <div>
                        <h2>Full Truth Table</h2>
                        <TruthTableOutput truthTable={truthTable} />
                    </div>
                }

                {simpleTruthTable && truthTable && (truthTable[0].length != simpleTruthTable[0].length) &&
                    <div>
                        <h2>Simple Truth Table</h2>
                        <TruthTableOutput truthTable={simpleTruthTable} />
                    </div>
                }
            </div>
        </>
    );
};