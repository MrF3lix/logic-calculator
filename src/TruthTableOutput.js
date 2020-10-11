import React, {useState, useEffect} from 'react';
import classnames from 'classnames';
import { getDNF, getKNF } from './lib/logic-eval';

export const TruthTableOutput = ({ truthTable }) => {
    const [dnf, setDnf] = useState();
    const [knf, setKnf] = useState();

    useEffect(() => {
        const dnf = getDNF([...truthTable]);
        const knf = getKNF([...truthTable]);

        setDnf(dnf);
        setKnf(knf);

    }, [truthTable]);

    return (
        <>
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

            {(dnf || knf) &&
                <>
                    <h3>Normalized Forms</h3>

                    <table>
                        <tbody>
                            <tr>
                                <th>DNF</th>
                                <td>{dnf ? dnf : 'Unerfüllbar'}</td>
                            </tr>
                            <tr>
                                <th>CNF</th>
                                <td>{knf ? knf : 'Allgemeingültig'}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            }
        </>
    );
};