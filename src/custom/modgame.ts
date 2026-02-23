import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState, ZStatePlus } from '../visi/zstate';
import { ExtraToggle } from '../visi/map';

import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from './gamedat';

/* Pull out the Royal Puzzle layout table. This is a 6x6 array, only
   there's 37 elements in the source, just go with it. */
export function get_cp_table(engine: GnustoEngine, state: ZState): any
{
    /* We only need the low bytes of this table, really. */
    let ls = [];
    for (let ix=0; ix<37; ix++)
        ls.push(engine.getByte(10931+2*ix))
    ;
    return {
        cptable: ls
    }
}

// Grid square size on the map.
const PUZZLE_GRID = 7.9375;

export function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let ls: ExtraToggle[] = [];
    if (zstate.globals[0] == 193) { // HERE == CP
        let cphere = zstate.globals[106]; // CPHERE
        let ycoord = Math.floor((cphere + 5) / 6);
        let xcoord = (cphere + 6 - ycoord*6);
        let transform = 'translate('+(xcoord-1)*PUZZLE_GRID+', '+(ycoord-1)*PUZZLE_GRID+')';
        ls.push({ id: 'cp-mob-winner', class: '', transform: transform });
    }
    else {
        ls.push({ id: 'cp-mob-winner', class: 'Offstage' });
    }
    return ls;
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

