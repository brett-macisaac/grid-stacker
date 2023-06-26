import Grid from "./Grid";
import Block from "./Block";
import utils from "../utils/utils";

class GridSymbol
{
    #fGrid;

    #fColourRandom;

    static sSymbolDefs7x7 = 
    {
        'arrowLeft': [ 
            0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0,
        ],
        'arrowRight': [ 
            0, 0, 1, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0,
        ],
        'arrowLeftDouble': [ 
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 1, 1, 0,
        ],
        'arrowRightDouble': [ 
            0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 0, 0, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
        ],
        'arrowLeftDoubleSplit': [ 
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
            1, 0, 1, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 1, 0,
        ],
        'arrowRightDoubleSplit': [ 
            0, 1, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 0, 0, 1, 0, 1,
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
        ],
        'arrowDown': [
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 1,
            0, 1, 0, 0, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
        ],
        'arrowDownDouble': [
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 1,
            1, 1, 0, 0, 0, 1, 1,
            1, 1, 1, 0, 1, 1, 1,
            0, 1, 1, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
        ],
        'arrowDownDoubleSplit': [
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 1,
            0, 1, 0, 0, 0, 1, 0,
            1, 0, 1, 0, 1, 0, 1,
            0, 1, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
        ],
        'clockwise': [
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0,
            0, 1, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1,
            0, 1, 1, 1, 1, 1, 0,
        ],
        'antiClockwise': [
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0,
            1, 0, 1, 0, 0, 0, 1,
            1, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1,
            0, 1, 1, 1, 1, 1, 0,
        ],
        'reflectionX': [
            0, 0, 1, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 1, 0, 1,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 1, 0, 0,
        ],
        'blockHold': [
            1, 0, 1, 0, 1, 0, 1,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 0, 0, 1,
            0, 0, 1, 1, 1, 0, 0,
            1, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 1, 0, 1,
        ],
    };

    constructor(pSymbolName, pColour)
    {
        this.#fGrid = new Grid(7, 7);

        const lBlockTypes = Object.keys(Block.Type);

        const lBlockTypeRandom = lBlockTypes[utils.GetRandom(0, lBlockTypes.length - 1)];

        this.#fColourRandom = Block.Colours[lBlockTypeRandom];

        let lColour = pColour;
        if (!lColour)
        {    
            lColour = this.#fColourRandom;
        }

        if (!Object.hasOwn(GridSymbol.sSymbolDefs7x7, pSymbolName))
        {
            pSymbolName = 'arrowLeft';
        }

        const lSymbolDef = GridSymbol.sSymbolDefs7x7[pSymbolName];

        for (let i = 0; i < lSymbolDef.length; ++i)
        {
            if (lSymbolDef[i] == 1)
            {
                this.#fGrid.grid[i] = lColour;
            }
        }
    }

    get randomColour()
    {
        return this.#fColourRandom;
    }

    get grid()
    {
        return this.#fGrid;
    }

    setColourRandom()
    {
        this.setColour(this.#fColourRandom);
    }

    setColour(pColour)
    {
        for (let i = 0; i < this.#fGrid.grid.length; ++i)
        {
            if (this.#fGrid.grid[i] != Grid.sColourEmptyTile)
            {
                this.#fGrid.grid[i] = pColour;
            }
        }
    }
}

export default GridSymbol;