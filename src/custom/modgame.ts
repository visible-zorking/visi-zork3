import { unpack_address } from '../visi/gametypes';
import { MapRoom } from '../visi/gametypes';
import { GnustoEngine, ZState, ZStatePlus } from '../visi/zstate';
import { OptPosition, ExtraToggle } from '../visi/map';

import { gamedat_routine_names, gamedat_global_names, gamedat_string_map, gamedat_object_ids, gamedat_roominfo_names } from './gamedat';

/* Pull out the Royal Puzzle layout table. This is a 6x6 array, only
   there's 37 elements in the source, just go with it. */
export function get_cp_table(engine: GnustoEngine, state: ZState): any
{
    /* We only need the low bytes of this table, really. "-1" in the
       source code will be 255 here. */
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

// Original block positions.
const orig_positions: { [key: string]: { x:number, y:number } } = {
    'cp-block-1': { x: 1, y: 0 },
    'cp-block-2': { x: 4, y: 0 },
    'cp-block-3': { x: 0, y: 1 },
    'cp-block-4': { x: 3, y: 3 },
    'cp-block-5': { x: 4, y: 3 },
    'cp-block-6': { x: 2, y: 4 },
    'cp-goodladder': { x: 4, y: 1 },
    'cp-badladder': { x: 0, y: 3 },
};

const maprange = [ 0, 1, 2, 3, 4, 5 ];

export function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let specifics = zstate.specifics as { cptable: number[] };

    let coverflag = zstate.globals[8]; // COVER-MOVED
    let aqflag = zstate.globals[9]; // AQ-FLAG
    let cleftflag = zstate.globals[60]; // CLEFT-FLAG
    let woodendoorflag = zstate.objects[103-1].attrs & 0x80000; // WOODEN-DOOR & OPENBIT
    let jeweldoorflag = zstate.objects[104-1].attrs & 0x80000; // JEWEL-DOOR & OPENBIT
    let cpflag = zstate.globals[183]; // CP-FLAG

    let coverstate = coverflag ? 'Invisible' : 'Visible';
    let aqstate = aqflag ? 'Invisible' : 'Visible';
    let cleftstate = cleftflag ? 'Invisible' : 'Visible';
    let woodendoorstate = woodendoorflag ? 'Invisible' : 'Visible';
    let jeweldoorstate = jeweldoorflag ? 'Invisible' : 'Visible';
    let cpstate = cpflag ? 'Invisible' : 'Visible';
    
    let ls: ExtraToggle[] = [
        { id: 'toggle-cover-moved', class: coverstate },
        { id: 'toggle-cleft', class: cleftstate },
        { id: 'toggle-aq-flag', class: aqstate },
        { id: 'toggle-wooden-door-1', class: woodendoorstate },
        { id: 'toggle-wooden-door-2', class: woodendoorstate },
        { id: 'toggle-wooden-door-3', class: woodendoorstate },
        { id: 'toggle-jewel-door-1', class: jeweldoorstate },
        { id: 'toggle-jewel-door-2', class: jeweldoorstate },
        { id: 'toggle-jewel-door-3', class: jeweldoorstate },
        { id: 'toggle-cp-flag', class: cpstate },
    ];
    
    let index = 0;
    for (let yp of maprange) {
        for (let xp of maprange) {
            let val = specifics.cptable[6*yp+xp+1];
            // 0 is empty, 255 is a block, 254 is goodladder, 253 is badladder.
            let key = '';
            if (val == 255) {
                index++;
                key = 'cp-block-' + index;
            }
            else if (val == 254) {
                key = 'cp-goodladder';
            }
            else if (val == 253) {
                key = 'cp-badladder';
            }
            if (key.length) {
                let orig = orig_positions[key];
                let transform = 'translate('+(xp-orig.x)*PUZZLE_GRID+', '+(yp-orig.y)*PUZZLE_GRID+')';
                ls.push({ id: key, transform: transform });
            }
        }
    }

    if (index != 6) {
        console.log('BUG: wrong number of 255 blocks');
    }
    
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

    let mobcen: OptPosition = null;
    let mloc = zstate.globals[93]; // MLOC
    let mlocinfo = gamedat_object_ids.get(mloc);
    let throomobj: MapRoom|undefined;
    if (mlocinfo) {
        throomobj = gamedat_roominfo_names.get(mlocinfo.name);
    }
    if (throomobj) {
        mobcen = throomobj.center;
    }
    if (mobcen) {
        let mdir = zstate.globals[78]; // MDIR
        let mtransform = 'translate('+mobcen.x+','+mobcen.y+'), rotate('+(mdir+90)+')';
        ls.push({ id: 'mob-mirror', transform: mtransform });
    }
    
    return ls;
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

