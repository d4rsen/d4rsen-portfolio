/**
 * Shared registry of active gravity sources (black holes), in viewport
 * coordinates. Black holes register themselves here; anything that wants to
 * be pulled in (e.g. the orbiting icons) reads from it every frame.
 */
export interface GravityWell {
    x: number;
    y: number;
    /** Current event horizon radius in px (0 while not yet formed) */
    radius: number;
}

const wells = new Set<GravityWell>();

export const addWell = (well: GravityWell) => {
    wells.add(well);
    return () => {
        wells.delete(well);
    };
};

export const getWells = (): ReadonlySet<GravityWell> => wells;
