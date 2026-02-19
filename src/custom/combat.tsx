import React from 'react';
import { useState, useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';

export function CombatTables()
{
    let rctx = useContext(ReactCtx);

    function evhan_click_id(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
        ev.preventDefault();
        let dat: ZilSourceLoc = { id: id, commentary: true };
        window.dispatchEvent(new CustomEvent('zil-source-location', { detail:dat }));
    }

    let pstrength = rctx.zstate.globals[45];  // P-STRENGTH
    let sstrength = rctx.zstate.globals[44];  // S-STRENGTH

    return (
        <div className="ScrollContent">
            <p>
                Combat is much simpler than in Zork 1. Your only opponent
                is the{' '}
                <a href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:SHADOW') }>hooded figure</a>,
                the only weapon is your sword, and there is no
                D&amp;D-style combat table.
            </p>
            <p>
                When you attack, your chance to hit is 60% if you are
                at full strength, decreasing to 20% as your injuries become
                serious. A successful hit has a 15% chance to be a
                serious wound (double damage).
            </p>
            <p>
                The figure&#x2019;s change to hit similarly starts at 60%,
                but when its strength is 1, its attack cannot succeed at all.
                A successful hit has a 10% chance to be serious, and
                only a serious hit can kill you. The figure holds back from
                killing you with a light wound.
            </p>
            <table className="CombatStrengthTable">
                <tr>
                    <th>Who</th>
                    <th>Strength</th>
                </tr>
                <tr>
                    <td><a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:ADVENTURER') }>ADVENTURER</a></td>
                    <td>
                        { (pstrength<5 ? <span className="ChangedNote">*</span> : null) }
                        { pstrength }
                    </td>
                </tr>
                <tr>
                    <td><a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:SHADOW') }>SHADOW</a></td>
                    <td>
                        { (sstrength<5 ? <span className="ChangedNote">*</span> : null) }
                        { sstrength }
                    </td>
                </tr>
            </table>
        </div>
    );
}
