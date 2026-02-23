import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from './gamedat';

/* Pull out the Royal Puzzle layout table. This is a 6x6 array, only
   it's 37 in the source, just go with it. */
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

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

