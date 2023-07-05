import Grid from "./Grid";
import Block from "./Block";
import utils from "../utils/utils";

class GridSymbol
{
    #fGrid;

    #fName;

    #fColour;

    #fColourRandom;

    static sSymbolDefs7x7 = 
    {
        'left': [ 
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 1, 1, 0,
        ],
        'right': [ 
            0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 0, 0, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 0, 0, 0,
        ],
        'leftMax': [ 
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
            1, 0, 1, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 1, 0,
        ],
        'rightMax': [ 
            0, 1, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 0, 0, 1, 0, 1,
            0, 0, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 0,
            0, 1, 0, 1, 0, 0, 0,
        ],
        'down': [
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 1,
            1, 1, 0, 0, 0, 1, 1,
            1, 1, 1, 0, 1, 1, 1,
            0, 1, 1, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 0, 0, 0,
        ],
        'downMax': [
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
        'anticlockwise': [
            0, 0, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0,
            1, 0, 1, 0, 0, 0, 1,
            1, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1,
            0, 1, 1, 1, 1, 1, 0,
        ],
        'rotate180': [
            0, 0, 1, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 1, 0, 1,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 1, 0, 0,
        ],
        'hold': [
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

        this.#fColour = pColour;
        if (!(this.#fColour))
        {    
            this.#fColour = this.#fColourRandom;
        }

        if (!Object.hasOwn(GridSymbol.sSymbolDefs7x7, pSymbolName))
        {
            pSymbolName = 'arrowLeft';
        }

        this.#fName = pSymbolName;

        const lSymbolDef = GridSymbol.sSymbolDefs7x7[pSymbolName];

        for (let i = 0; i < lSymbolDef.length; ++i)
        {
            if (lSymbolDef[i] == 1)
            {
                this.#fGrid.grid[i] = this.#fColour;
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

    get name()
    {
        return this.#fName;
    }

    get colour()
    {
        return this.#fColour;
    }

    setColourRandom()
    {
        this.setColour(this.#fColourRandom);
    }

    setColour(pColour)
    {
        this.#fColour = pColour;

        for (let i = 0; i < this.#fGrid.grid.length; ++i)
        {
            if (this.#fGrid.grid[i]) // != undefined
            {
                this.#fGrid.grid[i] = pColour;
            }
        }
    }
}

export default GridSymbol;