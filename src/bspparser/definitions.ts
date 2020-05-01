export enum Lumps {
    LUMP_ENTITIES                       = 0,
    LUMP_PLANES                         = 1,
    LUMP_TEXDATA                        = 2,
    LUMP_VERTEXES                       = 3,
    LUMP_VISIBILITY                     = 4,
    LUMP_NODES                          = 5,
    LUMP_TEXINFO                        = 6,
    LUMP_FACES                          = 7,
    LUMP_LIGHTING                       = 8,
    LUMP_OCCLUSION                      = 9,
    LUMP_LEAFS                          = 10,
    LUMP_EDGES                          = 12,
    LUMP_SURFEDGES                      = 13,
    LUMP_MODELS                         = 14,
    LUMP_WORLDLIGHTS                    = 15,
    LUMP_LEAFFACES                      = 16,
    LUMP_LEAFBRUSHES                    = 17,
    LUMP_BRUSHES                        = 18,
    LUMP_BRUSHSIDES                     = 19,
    LUMP_AREAS                          = 20,
    LUMP_AREAPORTALS                    = 21,
    LUMP_PORTALS                        = 22,
    LUMP_CLUSTERS                       = 23,
    LUMP_PORTALVERTS                    = 24,
    LUMP_CLUSTERPORTALS                 = 25,
    LUMP_DISPINFO                       = 26,
    LUMP_ORIGINALFACES                  = 27,
    LUMP_PHYSCOLLIDE                    = 29,
    LUMP_VERTNORMALS                    = 30,
    LUMP_VERTNORMALINDICES              = 31,
    LUMP_DISP_LIGHTMAP_ALPHAS           = 32,
    LUMP_DISP_VERTS                     = 33,
    LUMP_DISP_LIGHTMAP_SAMPLE_POSITIONS = 34,
    LUMP_GAME_LUMP                      = 35,
    LUMP_LEAFWATERDATA                  = 36,
    LUMP_PRIMITIVES                     = 37,
    LUMP_PRIMVERTS                      = 38,
    LUMP_PRIMINDICES                    = 39,
    LUMP_PAKFILE                        = 40,
    LUMP_CLIPPORTALVERTS                = 41,
    LUMP_CUBEMAPS                       = 42,
    LUMP_TEXDATA_STRING_DATA            = 43,
    LUMP_TEXDATA_STRING_TABLE           = 44,
    LUMP_OVERLAYS                       = 45,
    LUMP_LEAFMINDISTTOWATER             = 46,
    LUMP_FACE_MACRO_TEXTURE_INFO        = 47,
    LUMP_DISP_TRIS                      = 48
}

export interface cplane_t {
    m_Normal: number[]; // 3
    m_Distance: number; // float
    m_Type: number; // uint_8
    m_SignBits: number; // uint8_t
    pad: Buffer; // 0x2 = 2

}
export interface lump_t {
    fileofs: number;
    filelen: number;
    version: number;
    getLumpData?: <T>() => any;
    fourCc: string;
} // 0x10 = 16 dec

export interface dheader_t {
    ident: number;
    version: number;
    lumps: lump_t[]; // 64
    mapRevision: number;
}

export interface dplane_t { // size = 0x14 = 20 dec
    m_Normal: number[]; // 3
    m_Distance: number; // float
    m_Type: number; // uint_8
}

export interface dleaf_t {
    m_Contents: number;     // int32_t
    m_Cluster: number;        // int16_t
    m_Area: number;         // int16_t default: 9
    m_Flags: number;        // int16_t default: 7;
    m_Mins: number[];       // int16_t 3
    m_Maxs: number[];       // int16_t 3
    m_Firstleafface: number;        // uint16_t default: 7;
    m_Numleaffaces: number;        // uint16_t default: 7;
    m_Firstleafbrush: number;        // uint16_t default: 7;
    m_Numleafbrushes: number;        // uint16_t default: 7;
    m_LeafWaterDataID: number;        // int16_t default: 7;
}///Size=0x30 = 48

export interface dvertex_t { point: number[] };

const lumpEntrySizes: any[] = [];
// @ts-ignore
lumpEntrySizes[`${Lumps.LUMP_PLANES}`] = 20;
// @ts-ignore
lumpEntrySizes[`${Lumps.LUMP_LEAFS}`] = 48;
lumpEntrySizes[`${Lumps.LUMP_VERTEXES}`] = 12;
lumpEntrySizes[`${Lumps.LUMP_MODELS}`] = 48;
export const getLumpEntrySize = (lump: Lumps) => {
    return lumpEntrySizes[lump];
};


