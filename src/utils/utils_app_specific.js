import Block from "../classes/Block";
import utils from "./utils";

/*
* Returns a key used to index an object whose keys represent the grid size. One such object is the one that stores the
  local high-scores of each game.

* Parameters:
    > pColumns: the grid's number of columns.
    > pRows: the grid's number of rows.
*/
function getGridSizeKey(pColumns, pRows)
{
    return `${pColumns}x${pRows}`;
}

/*
* Returns a random block colour.
*/
function getRandomBlockColour()
{
    const lBlockTypes = Object.keys(Block.Type);

    return Block.Colours[lBlockTypes[utils.GetRandom(0, lBlockTypes.length - 1)]];
}

/*
* Returns a set of random block colours of length pNumColours where each colours is unique.
*/
function getRandomBlockColours(pNumColours)
{
    let lBlockTypes = Object.keys(Block.Type);

    const lNumBlocks = lBlockTypes.length;

    const lNumColours = pNumColours > lNumBlocks ? lNumBlocks : pNumColours;

    const lRandomColours = [];

    for (let i = 0; i < lNumColours; ++i)
    {
        const lBlockTypeRandom = lBlockTypes[utils.GetRandom(0, lBlockTypes.length - 1)];

        lRandomColours.push(Block.Colours[lBlockTypeRandom]);

        lBlockTypes = lBlockTypes.filter((pBlockType) => { return pBlockType != lBlockTypeRandom });
    }

    return lRandomColours;
}

const utilsAppSpecific = {
    getGridSizeKey: getGridSizeKey,
    getRandomBlockColour: getRandomBlockColour,
    getRandomBlockColours: getRandomBlockColours
}

export default utilsAppSpecific;