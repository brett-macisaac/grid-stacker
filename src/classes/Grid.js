import utils from "../utils/utils.js";
import Vector2D from "./Vector2D.js";
import Block from "./Block.js";


/*
 * An object of this class is a grid upon which blocks can be displayed.
 
 * Composition:
     (a). Enumerations (1)
     (b). Fields (11)
         (i). Fields (7) 
     (c). Constructors (4)
     (d). Public Methods (9)
     (e). Auxiliaries (1)
*/
class Grid
{
    
// Fields (11) =========================================================================================================
    
    /*
    * An array of colours which defines the grid.
    */
    #fGrid;
    
    /*
    * The dimensions of fGrid.
    */
    #fNumRows;
    #fNumColumns;

    /*
    * The falling block's 'shadow'.
    */
    #fBlockShadow;

    /*
    * The text to display on the grid.
    */
    #fText;
    
    
// Fields (7) ----------------------------------------------------------------------------------------------------------
    
    /*
    * An object to represent general position 'types' of the grid. 
    */
    static DrawPosition = Object.freeze(
        { 
            CentreMid: "CentreMid", 
            CentreLeft: "CentreLeft", 
            CentreTop: "CentreTop", 
            CentreBottom: "CentreBottom",
            TopTwoRows: "TopTwoRows" // Spawn in the 'earliest' available position within the top two rows.
        }
    );

    /*
    * The colour of an empty tile.
    */
    static sColourEmptyTile = "#000000";

    // The default number of columns (i.e. the number of tiles in each row).
    static S_NUM_COLUMNS_DEFAULT = 10;
    
    // The default number of rows (i.e. the number of tiles in each column).
    static S_NUM_ROWS_DEFAULT = 22;
    
    // The maximum number of rows (max value of this.#fNumRows).
    static S_MAX_NUM_ROWS = 50;
    
    // The minimum number of rows (min value of this.#fNumRows).
    static S_MIN_NUM_ROWS = 4;
    
    // The maximum number of columns (max value of this.#fNumColumns).
    static S_MAX_NUM_COLUMNS = 25;
    
    // The minimum number of columns (min value of this.#fNumColumns).
    static S_MIN_NUM_COLUMNS = 4;

    
// Constructors (1) ====================================================================================================
    
    /* Constructor
     
    * Parameters:
    */
    constructor(aNumColumns, aNumRows, aText = "")
    {
        // Store references of all the tiles.
        this.#fGrid = Array(aNumColumns * aNumRows).fill(Grid.sColourEmptyTile);

        this.#fNumRows = aNumRows;
        this.#fNumColumns = aNumColumns;

        this.#fText = aText;
    }
    
    
// Public Methods (9) ==================================================================================================

    copy()
    {
        const lCopy = new Grid(this.#fNumColumns, this.#fNumRows, this.#fText);

        let lIndex = 0;

        for (const colour of this.#fGrid)
        {
            lCopy.grid[lIndex++] = colour;
        }

        return lCopy;
    }

    get dimension()
    {
        return { columns: this.#fNumColumns, rows: this.#fNumRows };
    }

    set text(aText)
    {
        this.#fText = aText;
    }

    get text()
    {
        return this.#fText;
    }

    get grid()
    {
        return this.#fGrid
    }

    GetIndex(aCol, aRow)
    {
        return aRow * this.#fNumColumns + aCol;
    }

    GetTile(aCol, aRow)
    {
        return this.#fGrid[this.GetIndex(aCol, aRow)];
    }

    SetTileColour(aCol, aRow, aColour)
    {
        // Will this work?
        this.#fGrid[this.GetIndex(aCol, aRow)] = aColour;
    }

    IsTileEmpty(aCol, aRow)
    {
        return this.GetTile(aCol, aRow) === Grid.sColourEmptyTile;
    }

    /*
     * This method returns true if the given position/coordinate is empty; false if otherwise.
     
     * Parameters:
         > aPosition: the position being checked.
    */
    IsPositionEmpty(aPosition)
    {
        return this.IsTileEmpty(aPosition.x, aPosition.y);
    }

    /*
     * Sets all of the tiles to the colour Grid.sColourEmptyTile (i.e. 'empties' the grids' tiles).
    */
    Reset()
    {
        this.#fGrid.fill(Grid.sColourEmptyTile);
    }
    
    /*
     * Returns true if the grid is completely empty; false if otherwise.
    */
    IsEmpty()
    {
        const lIndexBottomRow = this.#fNumRows - 1;
        
        // If the bottom row is empty, all other rows must also be empty.
        for (let col = 0; col < this.#fNumColumns; ++col)
        {
            if (!this.IsTileEmpty(col, lIndexBottomRow)) // If the tile isn't empty.
            { return false; }
        }
        
        return true;
    }
    
    /*
    * Clears all rows that are full and also shifts all other (non-full) rows downwards.
     
     * Return Value:
         > The number of full rows that were cleared. 
    */
    async RemoveFullLines() //throws InterruptedException
    {   
        // The time to pause between individual tiles being shifted down (ms).
        const lLengthPause = 20;

        // The number of full rows found thus far.
        let lNumFullRows = 0;
        
        for (let row = this.#fNumRows - 1; row >= 0; --row)
        {   
            let lIsRowFull = true;
            let lIsRowEmpty = true;
            
            for (let col = 0; col < this.#fNumColumns; ++col)
            {
                if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                {
                    break;
                }
                else if (this.IsTileEmpty(col, row))
                {
                    // If at least one tile is empty, the row can't be full.
                    lIsRowFull = false;
                }
                else // if (!this.IsTileEmpty(col, row))
                {
                    // If at least one tile is filled, the row can't be empty.
                    lIsRowEmpty = false;
                }
                
            }
            
            if (lIsRowFull) 
            { 
                // Record occurrence of full row.
                ++lNumFullRows;
                
                // Clear the row.
                for (let col = 0; col < this.#fNumColumns; ++col)
                {
                    if (this.IsTileEmpty(col, row))
                    { continue; }
                    
                    this.SetTileColour(col, row, Grid.sColourEmptyTile);

                    await utils.SleepFor(lLengthPause);
                }
                
            }
            else if (lIsRowEmpty) // If the row is empty, this means that all rows above it are also empty.
            {
                break;
            }
            else if (lNumFullRows !== 0) // && !lIsRowFull && !lIsRowEmpty (if the row isn't full and isn't empty: i.e. semi-filled).
            {
                // Shift the (non-full, non-empty) row down lNumFullRows rows.
                for (let col = 0; col < this.#fNumColumns; ++col)
                {
                    // n.b. it's '+ lNumFullRows' not '- lNumFullRows' because under the current coordinate system
                    // the row index (y-coordinate) increases down the screen.
                    
                    if (this.IsTileEmpty(col, row))
                    { continue; }
                    
                    // Copy the colour of the tile at coordinate (col,row) to the appropriate row (row + lNumFullRows).
                    //fGrid[col][row + lNumFullRows].SetColour(fGrid[col][row].GetColour());
                    this.SetTileColour(col, row + lNumFullRows, this.GetTile(col, row))
                    
                    // Clear the colour of the tile at coordinate (col,row).
                    this.SetTileColour(col, row, Grid.sColourEmptyTile);
                    
                    await utils.SleepFor(lLengthPause);
                }
                
            }
            
        }
        
        // Return the number of full rows that were cleared.
        return lNumFullRows;
    }
    
    /*
     * This method returns true if the given position/coordinate is both valid (within valid bounds) and empty; false if
       otherwise.
       
     * Parameters:
         > aPosition: the position being checked.
    */
    CanBeMovedTo(aPosition)
    {
        return this.IsPositionOnBoard(aPosition) && this.IsPositionEmpty(aPosition);
    }
    
    /*
     * This method returns true if the given position/coordinate is valid (within valid bounds); false if otherwise.
     
     * Parameters:
         > aPosition: the position being checked.
    */
    IsPositionOnBoard(aPosition)
    {
        return (aPosition.x >= 0 && aPosition.x <= this.#fNumColumns - 1) && 
               (aPosition.y >= 0 && aPosition.y <= this.#fNumRows - 1);
    }
    
    /*
    * This method draws the given tetromino at the given position 'type'.
     
    * Parameters:
        > aBlock: the tetromino to be drawn onto the grid.
        > a_draw_pos: the position 'type' at which the tetromino is to be drawn.
         
    * Return Value:
        > True is returned if the tetromino is successfully drawn; false if otherwise. 
    */
    DrawBlockAt(aBlock, aDrawPosition, aDrawShadow = true)
    {
        let lSpawnLocation;
        
        if (aDrawPosition === Grid.DrawPosition.CentreTop)
        {
            // The tetrominos' centre points should be in the second row (y coordinate is 1)
            // The tetrominos should be centred in the columns (round to the left).
            lSpawnLocation = new Vector2D(Math.floor((this.#fNumColumns - 1) / 2), 1);
        }
        else if (aDrawPosition === Grid.DrawPosition.TopTwoRows)
        {
            lSpawnLocation = new Vector2D(0, 0);

            for (let row = 0; row < 2; ++row)
            {
                lSpawnLocation.y = row;

                for (let col = 0; col < this.#fNumColumns; ++col)
                {
                    lSpawnLocation.x = col;

                    aBlock.position = lSpawnLocation;
    
                    if (!this.DrawBlock(aBlock, aDrawShadow))
                        continue;

                    return true;
                }
            }

            return false;
        }
        else // if (a_spawn_pos == SpawnPosition.CentreMid) (should have one for each DrawPosition)
        {
            lSpawnLocation = new Vector2D(Math.floor((this.#fNumColumns - 1) / 2), Math.floor(this.#fNumRows / 2));
        }
        
        aBlock.position = lSpawnLocation;
        
        return this.DrawBlock(aBlock, aDrawShadow);
    }
    
    /*
    * This method draws the given tetromino at its current position.
     
    * Parameters:
        > aBlock: the tetromino to be drawn onto the grid.
         
    * Return Value:
        > True is returned if the tetromino is successfully drawn; false if otherwise. 
    */
    DrawBlock(aBlock, aDrawShadow = true)
    {
        // Check if the position is invalid.
        let lIsPositionValid = true;

        for (const v of aBlock.position) 
        {
            if (!this.CanBeMovedTo(v))
            {
                lIsPositionValid = false;
                break;
            }
        }
        
        // Return if the tetromino's position is invalid.
        if (!lIsPositionValid) 
            return false;

        // Get the tetromino's colour.
        const lColourBlock = aBlock.GetColour();

        // Draw the shadow.
        if (aDrawShadow)
        {
            // The shadow tetromino
            this.#fBlockShadow = aBlock.copy();

            this.#fBlockShadow.colour = Block.sColourShadow;

            let lLengthDrop = this.#fBlockShadow.Drop(this, false);

            // Draw the shadow if the distance from it to aBlock is greater than 3 rows.
            if (lLengthDrop < 4)
                this.UnDrawBlock(this.#fBlockShadow, false);
        }

        // Draw the tetromino.
        for (const v of aBlock.position) 
        {
            this.SetTileColour(v.x, v.y, lColourBlock);
        }
        
        return true;
    }
    
    /*
     * This method removes the given tetromino from the grid.
     
     * Parameters:
         > aBlock: the tetromino to be drawn onto the grid.
    */
    UnDrawBlock(aBlock, aUndrawShadow = true)
    {
        // Check if the position is invalid.
        let lIsPositionValid = true;
        for (const v of aBlock.position) 
        {
            if (!this.IsPositionOnBoard(v))
            {
                lIsPositionValid = false;
                break;
            }
        }
        
        // Return if the tetromino's position is invalid.
        if (!lIsPositionValid)
        { return; }

        // Remove the 'shadow' tetromino.
        if (aUndrawShadow)
            this.UnDrawBlock(this.#fBlockShadow, false);
        
        // Remove the tetromino.
        for (const v of aBlock.position) 
        {
            this.SetTileColour(v.x, v.y, Grid.sColourEmptyTile);
        }
        
    }
    
}

export default Grid;