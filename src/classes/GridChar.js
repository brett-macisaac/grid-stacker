import Grid from "./Grid";
import Block from "./Block";
import utils from "../utils/utils";

class GridChar
{
    #fGrid;

    #fColourRandom;

    static sCharDefs5x7 = 
    {
        'G': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '0',
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '1', '1', 
            '1', '0', '0', '0', '1', 
            '0', '1', '1', '1', '0', 
        ],
        'R': [ 
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
        ],
        'I': [ 
            '0', '1', '1', '1', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0',
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '1', '1', '1', '0', 
        ],
        'D': [ 
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '0', 
        ],
        'S': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '',
            '0', '1', '1', '1', '0', 
            '0', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '0', '1', '1', '1', '0', 
        ],
        'T': [ 
            '1', '1', '1', '1', '1', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0',
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
        ],
        'A': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
        ],
        'C': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '0',
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '1', 
            '0', '1', '1', '1', '0', 
        ],
        'K': [ 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '1', '0', 
            '1', '0', '1', '0', '0',
            '1', '1', '0', '0', '0', 
            '1', '0', '1', '0', '0', 
            '1', '0', '0', '1', '0', 
            '1', '0', '0', '0', '1', 
        ],
        'E': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0',
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '1', '1', '1', '1', 
        ],
        'P': [
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '0', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
        ],
        'L': [ 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0',
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '1', '1', '1', '1', 
        ],
        'Y': [ 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '0', '1', '0', '1', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
        ],
        'N': [
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '1', '0', '0', '1',
            '1', '0', '1', '0', '1', 
            '1', '0', '0', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
        ],
        'X': [ 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '0', '1', '0', '1', '0',
            '0', '0', '1', '0', '0', 
            '0', '1', '0', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
        ],
        'M': [
            '1', '0', '0', '0', '1', 
            '1', '1', '0', '1', '1', 
            '1', '0', '1', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
        ],
        'O': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '0', '1', '1', '1', '0', 
        ],
        'U': [ 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '0', '1', '1', '1', '0', 
        ],
        '0': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '1': [ 
            '0', '0', '1', '0', '0', 
            '0', '1', '1', '0', '0', 
            '0', '0', '1', '0', '0',
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '1', '1', '1', '0', 
        ],
        '2': [ 
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1',
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '1', '1', '1', '1', 
        ],
        '3': [ 
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1',
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '4': [ 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1', 
        ],
        '5': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0',
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '6': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '0', 
            '1', '0', '0', '0', '0',
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '7': [ 
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1',
            '0', '0', '0', '1', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '1', '0', '0', 
        ],
        '8': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '9': [ 
            '1', '1', '1', '1', '1', 
            '1', '0', '0', '0', '1', 
            '1', '0', '0', '0', '1',
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1', 
            '1', '1', '1', '1', '1', 
        ],
        '?': [ 
            '0', '1', '1', '1', '0', 
            '1', '0', '0', '0', '1', 
            '0', '0', '0', '0', '1',
            '0', '0', '0', '1', '0', 
            '0', '0', '1', '0', '0', 
            '0', '0', '0', '0', '0', 
            '0', '0', '1', '0', '0', 
        ],
        '<': [ 
            '0', '0', '0', '1', '1', 
            '0', '0', '1', '1', '0', 
            '0', '1', '1', '0', '0',
            '1', '1', '', '0', '0', 
            '0', '1', '1', '0', '0', 
            '0', '0', '1', '1', '0', 
            '0', '0', '0', '1', '1', 
        ],
        '>': [ 
            '1', '1', '0', '0', '0', 
            '0', '1', '1', '0', '0', 
            '0', '0', '1', '1', '0',
            '0', '0', '0', '1', '1', 
            '0', '0', '1', '1', '0', 
            '0', '1', '1', '0', '0', 
            '1', '1', '0', '0', '0', 
        ],
        '}': [ 
            '0', '0', '1', '0', '0', 
            '0', '0', '0', '1', '0', 
            '1', '1', '1', '0', '1',
            '1', '0', '0', '1', '0', 
            '1', '0', '1', '0', '0', 
            '1', '0', '0', '0', '0', 
            '1', '1', '1', '1', '0', 
        ],
        '^': [ 
            '0', '0', '1', '0', '0', 
            '0', '1', '0', '1', '0', 
            '0', '0', '0', '0', '0',
            '1', '1', '1', '1', '1', 
            '0', '0', '0', '0', '0', 
            '0', '1', '0', '1', '0', 
            '0', '0', '1', '0', '0', 
        ],
    };

    constructor(pChar, pColour)
    {
        this.#fGrid = new Grid(5, 7);

        const lBlockTypes = Object.keys(Block.Type);

        const lBlockTypeRandom = lBlockTypes[utils.GetRandom(0, lBlockTypes.length - 1)];

        this.#fColourRandom = Block.Colours[lBlockTypeRandom];

        let lColour = pColour;
        if (!lColour)
        {    
            lColour = this.#fColourRandom;
        }

        if (!Object.hasOwn(GridChar.sCharDefs5x7, pChar))
        {
            pChar = '?';
        }

        const lCharDef = GridChar.sCharDefs5x7[pChar];

        for (let i = 0; i < lCharDef.length; ++i)
        {
            if (lCharDef[i] == '1')
            {
                this.#fGrid.grid[i] = lColour;
            }
        }
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

export default GridChar;