import React from 'react';
import { useState, useContext, createContext } from 'react';

import { ZObject } from '../visi/zstate';
import { signed_zvalue } from '../visi/gametypes';
import { ObjectData, GlobalData } from '../visi/gametypes';
import { ReactCtx, StackCallCtx } from '../visi/context';
import { ArgShowObject, ArgShowProperty } from '../visi/actshowers';
import { VarShowObject, VarShowProperty } from '../visi/globshow';
import { gamedat_ids, gamedat_distances, gamedat_object_treesort } from './gamedat';

export function contains_label(obj: ObjectData) : string
{
    if (!obj.isroom) {
        if (obj.onum == gamedat_ids.ADVENTURER
            || obj.onum == gamedat_ids.MAN
            || obj.onum == gamedat_ids.OLD_MAN
            || obj.onum == gamedat_ids.SHADOW)
            return 'carries';
        else
            return 'contains'
    }
    return '';
}

export function sorter_for_key(key: number) : (roots:ZObject[], map:Map<number, ZObject>) => void
{
    let originobj: number = gamedat_ids.ADVENTURER;

    return function(roots: ZObject[], map: Map<number, ZObject>) {
        let advroom = originobj;

        while (true) {
            let tup = map.get(advroom);
            if (!tup || tup.parent == 0 || tup.parent == gamedat_ids.ROOMS)
                break;
            advroom = tup.parent;
        }
        
        if (!gamedat_distances[advroom])
            advroom = gamedat_ids.STARTROOM;
        let distmap = gamedat_distances[advroom];

        roots.sort((o1, o2) => {
            let sort1 = gamedat_object_treesort.get(o1.onum) ?? 0;
            let sort2 = gamedat_object_treesort.get(o2.onum) ?? 0;
            if (sort1 != sort2)
                return sort1 - sort2;
            if (sort1 == 1 && distmap !== undefined)
                return distmap[o1.onum] - distmap[o2.onum];
            return (o1.onum - o2.onum);
        });
    }
}

export function ObjListSorter({ followKey, setFollowKey } : { followKey:number, setFollowKey:(v:number)=>void })
{
    return (
        <div>
            (Following Adventurer)
        </div>
    );
}

export function global_value_display(tag: string, value: number, glo: GlobalData) : JSX.Element|null
{
    switch (tag) {
        
    case 'PRSO':
        let rctx = useContext(ReactCtx);
        if (rctx.zstate.globals[172] == 121) {  /* PRSA == WALK */
            return (
                <VarShowProperty value={ value } />
            )
        }
        return (
            <VarShowObject value={ value } />
        )
        
    case 'DEGREES':
        return (
            <>{ value } <i>degrees</i></>
        );
        
    case 'PUZXY':
        return (
            <ArgShowPuzXY value={ value } />
        );
        
    }
    
    return null;
}

export function stack_call_arg_display(tag: string, value: number) : JSX.Element|null
{
    switch (tag) {
        
    case 'PERFORMO':
        let ctx = useContext(StackCallCtx);
        if (ctx.args[0] == 121) {      /* action WALK */
            return (
                <ArgShowProperty value={ value } />
            );
        }
        return (
            <ArgShowObject value={ value } />
        )
        
    case 'PERFORMI':
        return (
            <ArgShowObject value={ value } />
        )

    case 'LKPITM': 
        let ctx2 = useContext(StackCallCtx);
        if (ctx2.args[1] == 11022          /* global CPEXITS */
            || ctx2.args[1] == 11472       /* global DIRS */
            || ctx2.args[1] == 11130) {    /* global DIRVEC */
            return (
                <ArgShowProperty value={ value } />
            );
        }
        return (
            <ArgShowObject value={ value } />
        )

    case 'PUZXY':
        return (
            <ArgShowPuzXY value={ value } />
        )

    case 'PUZVEC':
        return (
            <ArgShowPuzVec value={ value } />
        )
    }

    return null;
}

export function ArgShowPuzXY({ value }: { value:number })
{
    let svalue = signed_zvalue(value);
    
    let ycoord = Math.floor((svalue + 5) / 6);
    let xcoord = (svalue + 6 - ycoord*6);
    return (
        <span>{ svalue }<i>(x={ xcoord },y={ ycoord })</i></span>
    )
}

export function ArgShowPuzVec({ value }: { value:number })
{
    let svalue = signed_zvalue(value);
    
    let str = '???';
    switch (svalue) {
    case 0:
        str = 'none';
        break;
    case -1:
        str = 'west';
        break;
    case 1:
        str = 'west';
        break;
    case -6:
        str = 'north';
        break;
    case 6:
        str = 'south';
        break;
    case -7:
        str = 'northwest';
        break;
    case -5:
        str = 'northeast';
        break;
    case 5:
        str = 'southwest';
        break;
    case 7:
        str = 'southeast';
        break;
    }
    return (
        <span>{ svalue }<i>({ str })</i></span>
    )
}

