import * as fs from 'fs';
import {dheader_t, dleaf_t, dplane_t, dvertex_t, getLumpEntrySize, lump_t, Lumps} from "./definitions";

// const file = fs.readFileSync('de_dust2.bsp');


const readLumps = (file: Buffer): lump_t[] => {
    const headerHeightTillLumps = 8;
    const sizeOfLump = 16; // dec hex = 16
    const lumpList: lump_t[] = [];
    for (let i = 0; i <= 64; i++) {
        const lump: lump_t = {
            fileofs: 0,
            filelen: 0,
            version: 0,
            fourCc: '',
        };
        const currentLumpPosition = headerHeightTillLumps + (sizeOfLump * i);
        lump.fileofs = file.readInt32LE(currentLumpPosition);
        lump.filelen = file.readInt32LE(currentLumpPosition + 4);
        lump.version = file.readInt32LE(currentLumpPosition + 8);
        lump.fourCc = 'NOT NEEDED';
        lumpList.push(lump);

    }
    return lumpList;
};


const positionAfterLumps = (file: Buffer) => {
    const headerHeightTillLumps = 8;
    const sizeOfLump = 16; // dec hex = 16
    const lumpList: lump_t[] = [];
    return headerHeightTillLumps + (sizeOfLump * 64);
};


/*
interface dleaf_t {
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
 */

const getAllLeafes = (file: Buffer, lumps: lump_t[]): dleaf_t[] => {
    const leafes: dleaf_t[] = [];
    const leafLump = lumps[Lumps.LUMP_LEAFS];
    const entrySize = getLumpEntrySize(Lumps.LUMP_LEAFS);
    const leafCount = leafLump.fileofs / entrySize;
    /*
    /*
    class dleaf_t
    {
    public:
        int32_t             m_Contents;        /// 0x00
        int16_t             m_Cluster;         /// 0x04
        int16_t             m_Area : 9;        /// 0x06
        int16_t             m_Flags : 7;       /// 0x11
        array< int16_t, 3 > m_Mins;            /// 0x1A
        array< int16_t, 3 > m_Maxs;            /// 0x20
        uint16_t            m_Firstleafface;   /// 0x26
        uint16_t            m_Numleaffaces;    /// 0x28
        uint16_t            m_Firstleafbrush;  /// 0x2A
        uint16_t            m_Numleafbrushes;  /// 0x2C
        int16_t             m_LeafWaterDataID; /// 0x2E
    };
 */

    for (let i = 0; i <= leafCount; i++) {
        const leaf: dleaf_t = {m_Normal: [],} as any;
        leaf.m_Contents = file.readInt32LE(leafLump.fileofs + (entrySize * i));
        leaf.m_Cluster = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 4);
        leaf.m_Area = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 6);
        leaf.m_Flags = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 17);


        leaf.m_Mins[0] = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 16);
        leaf.m_Mins[1] = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 16);
        leaf.m_Mins[2] = file.readInt16LE(leafLump.fileofs + (entrySize * i) + 16);
        leafes.push(leaf);
    }
    return leafes;
};
const getAllPlanes = (file: Buffer, lumps: lump_t[]): dplane_t[] => {
    const planes: dplane_t[] = [];
    const planeLump = lumps[Lumps.LUMP_PLANES];
    const entrySize = getLumpEntrySize(Lumps.LUMP_PLANES);
    const planeCount = planeLump.fileofs / entrySize;
    for (let i = 0; i <= planeCount; i++) {
        const plane: dplane_t = {m_Normal: [],} as any;
        plane.m_Normal[0] = file.readFloatLE(planeLump.fileofs + (entrySize * i));
        plane.m_Normal[1] = file.readFloatLE(planeLump.fileofs + (entrySize * i) + 0x4);
        plane.m_Normal[2] = file.readFloatLE(planeLump.fileofs + (entrySize * i) + 0x8);
        plane.m_Distance = file.readFloatLE(planeLump.fileofs + (entrySize * i) + 0x12);
        plane.m_Type = file.readUInt8(planeLump.fileofs + (entrySize * i) + 0x16);

        const distRecheck = plane.m_Normal[0] + plane.m_Normal[1] + plane.m_Normal[2];
        if (distRecheck === plane.m_Distance) {
            // console.log(`Plane ${i} seems to be valid`);
            planes.push(plane);
        } else {
            // console.log(`Plane ${i} seems to be invalid`);
        }
    }
    return planes;
};

const getAllVertexes = (file: Buffer, lumps: lump_t[]): dvertex_t[] => {
    const vertexes: dvertex_t[] = [];
    const vertexLump = lumps[Lumps.LUMP_VERTEXES];
    const entrySize = getLumpEntrySize(Lumps.LUMP_VERTEXES);
    const vertexCount = vertexLump.fileofs / entrySize;
    for (let i = 0; i <= vertexCount; i++) {
        const vertex: dvertex_t = [] as any;
        vertex[0] = file.readFloatLE(vertexLump.fileofs + (entrySize * i));
        vertex[1] = file.readFloatLE(vertexLump.fileofs + (entrySize * i) + 0x4);
        vertex[2] = file.readFloatLE(vertexLump.fileofs + (entrySize * i) + 0x8);
        vertexes.push(vertex);
        }
    return vertexes;
};

interface dmodel_t {
    mins: number[];
    maxs: number[];
    origin: number[];
    headnode: number;
    firstface: number;
    numfaces: number;
}
const getAllModels = (file: Buffer, lumps: lump_t[]): dmodel_t[] => {
    const models: dmodel_t[] = [];
    const modelLump = lumps[Lumps.LUMP_MODELS];
    const entrySize = getLumpEntrySize(Lumps.LUMP_MODELS);
    const modelCount = modelLump.fileofs / entrySize;
    for (let i = 0; i <= modelCount; i++) {
        const model: dmodel_t = {mins: [], maxs: [], origin: []} as any;
        model.mins[0] = file.readFloatLE(modelLump.fileofs + (entrySize * i));
        model.mins[1] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x4);
        model.mins[2] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x8);

        model.maxs[0] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x12);
        model.maxs[1] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x16);
        model.maxs[2] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x20);

        model.origin[0] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x24);
        model.origin[1] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x28);
        model.origin[2] = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x32);

        model.headnode = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x36);
        model.firstface = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x40);
        model.numfaces = file.readFloatLE(modelLump.fileofs + (entrySize * i) + 0x44);
        models.push(model);
    }
    return models;
};
/*
struct dmodel_t
{
	Vector	mins, maxs;		// bounding box
	Vector	origin;			// for sounds or lights
	int	headnode;		// index into node array
	int	firstface, numfaces;	// index into face array
};
 */
export const readBspFile = (file: Buffer): { header: dheader_t, planes: dplane_t[], vertexes: dvertex_t[], models: dmodel_t[] } => {
    const header: dheader_t = {
        ident: file.readInt32LE(0),
        version: file.readInt32LE(4),
        lumps: readLumps(file),
        mapRevision: file.readInt32LE(positionAfterLumps(file)),
    };
    const planes = getAllPlanes(file, header.lumps);
    const vertexes = getAllVertexes(file, header.lumps);
    const models = getAllModels(file, header.lumps);
    // console.log(planes);

    /*console.log(`Ident: ${file.readInt32LE(0)}`);
    console.log(`Version: ${file.readInt32LE(4)}`);
    console.log(readLumps(file));*/
    return {header, planes, vertexes, models};

};

// readBspFile(file);
