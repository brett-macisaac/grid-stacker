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

    /*
    * When a user tries to move a block on the grid, the movement might be prevented by one of two things:
        (1). A grid boundary, or
        (2). Another already-placed block.
      When this is true, the blocks movement was blocked by the grid boundary; if otherwise, false.
    * Distinguishing between these two movement impediments might be useful when designing the game's sound effects.
    */
    #fWasMoveBlockedByBoundary;
    
    
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
            TopThreeRows: "TopThreeRows" // Spawn in the 'earliest' available position within the top two rows.
        }
    );

    /*
    * The colour of an empty tile.
    */
    //static sColourEmptyTile = "#000000";

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
        this.#fGrid = Array(aNumColumns * aNumRows).fill(undefined);

        this.#fNumRows = aNumRows;
        this.#fNumColumns = aNumColumns;

        this.#fText = aText;

        this.#fWasMoveBlockedByBoundary = false;
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
        return this.#fGrid;
    }

    get wasMoveBlockedByBoundary()
    {
        return this.#fWasMoveBlockedByBoundary;
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
        this.#fGrid[this.GetIndex(aCol, aRow)] = aColour;
    }

    EmptyTile(aCol, aRow)
    {
        this.SetTileColour(aCol, aRow, undefined);
    }

    IsTileEmpty(aCol, aRow)
    {
        return this.GetTile(aCol, aRow) == undefined;
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
    * Sets all of the tiles to undefined (i.e. empty the grids' tiles).
    */
    Reset()
    {
        this.#fGrid.fill(undefined);
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

    GetNumFullLines()
    {
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
            }
            // else if (lIsRowEmpty) // If the row is empty, this means that all rows above it are also empty.
            // {
            //     break;
            // }
        }
        
        // Return the number of full rows.
        return lNumFullRows;
    }

    /*
    * Returns whether the grid would be empty after clearing.
    */
    IsEmptyAfterClear()
    {
        if (this.IsEmpty())
            return true;

        for (let row = this.#fNumRows - 1; row >= 0; --row)
        {   
            let lIsRowFull = true;
            let lIsRowEmpty = true;
            
            for (let col = 0; col < this.#fNumColumns; ++col)
            {
                if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                {
                    return false;
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
        }

        return true;
    }

    /*
    * This method returns true if the given position/coordinate is both valid (within valid bounds) and empty; false if
       otherwise.
    * It's expected that the Block class will use this method in the process of determining whether a block can be 
      moved in a given direction.
       
     * Parameters:
         > aPosition: the position being checked.
    */
    CanBeMovedTo(aPosition)
    {
        const lCanMove = this.IsPositionOnBoard(aPosition) && this.IsPositionEmpty(aPosition);

        if (!lCanMove)
        {
            if (!this.IsPositionOnBoard(aPosition))
                this.#fWasMoveBlockedByBoundary = true;
            else 
                this.#fWasMoveBlockedByBoundary = false;
            
        }
        return lCanMove;
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
        else if (aDrawPosition === Grid.DrawPosition.TopThreeRows)
        {
            lSpawnLocation = new Vector2D(0, 0);

            for (let row = 0; row < 3; ++row)
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

        if (this.DrawBlock(aBlock, aDrawShadow))
        {
            return true;
        }
        else if (aDrawPosition !== Grid.DrawPosition.TopThreeRows)
        {
            return this.DrawBlockAt(aBlock, Grid.DrawPosition.TopThreeRows, aDrawShadow);
        }
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
        // if (aDrawShadow)
        // {
        //     // The shadow tetromino
        //     this.#fBlockShadow = aBlock.copy();

        //     this.#fBlockShadow.colour = Block.sColourShadow;

        //     let lLengthDrop = this.#fBlockShadow.Drop(this, false);

        //     // Draw the shadow if the distance from it to aBlock is greater than 3 rows.
        //     if (lLengthDrop < 4)
        //         this.UnDrawBlock(this.#fBlockShadow, false);
        // }

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
        { 
            console.log("Invalid position!");
            return; 
        }

        // Remove the 'shadow' tetromino.
        // if (aUndrawShadow && this.#fBlockShadow)
        //     this.UnDrawBlock(this.#fBlockShadow, false);
        
        // Remove the tetromino.
        for (const v of aBlock.position) 
        {
            this.EmptyTile(v.x, v.y);
        }
        
    }
    
}

export default Grid;