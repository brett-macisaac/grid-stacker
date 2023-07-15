import Vector2D from "./Vector2D.js";
import utils from "../utils/utils.js";

/* Block Class
 * Each object of this class represents a block.
 
 * Composition:
     (a). Enums (1)
     (b). Fields (17)
         (i). Static Fields (14)
     (c). Constructors (1)
     (d). Methods (9)
         (i). Accessors (2)
         (ii). Mutators (1)
     (e). Auxiliaries (3)
*/
class Block
{

// Fields (18) =========================================================================================================

    // The block's type.
    #fType;
    
    /*
     * The positions of each tile.
     * this.#fPositions[0] is the position of the tile around which the others rotate.
    */
    #fPositions = [];
    
    /*
     * The value that indicates the current rotation state of the block.
     * There are four rotation states, represented by the indexes 0, 1, 2, and 3: i.e. a block can only be rotated 
       by 90 degrees at a time.
    */
    #fIndexRotation;

    /*
     * A colour unique to this block (i.e. not necessarily one of the 'stock' ones from Block.Colours).
    */
    #fColour = undefined;
    
    
// Static Fields (16) --------------------------------------------------------------------------------------------------
    
    // An object whose values represent each of the different types of block.
    static Type = Object.freeze(    
        { 
            I: "I", 
            J: "J", 
            L: "L", 
            O: "O", 
            S: "S", 
            T: "T", 
            Z: "Z" 
        }
    );

    // Original/classic colours.
    // static Colours = Object.freeze(    
    //     { 
    //         I: '#00ebeb', // I
    //         J: '#0000ff', // J
    //         L: '#ff8000', // L
    //         O: '#ebeb00', // O
    //         S: '#00eb00', // S
    //         T: '#eb00eb', // T
    //         Z: '#eb0000'  // Z
    //     }
    // );

    // An object whose values represent each of the block colours (darker than originals).
    // Maybe change to minimise chance of lawsuit.
    static Colours = Object.freeze(    
        { 
            I: '#099797', // I
            J: '#4444FA', // J
            L: '#c46506', // L
            O: '#c0c007', // O
            S: '#06b306', // S
            T: '#ad06ad', // T
            Z: '#bb0505'  // Z
        }
    );

    // Each block is composed of four tiles (size of this.#fPositions).
    static sNumTiles = 4;
    
    // The number of rotation indexes (0 to 3) (i.e. the number of values this.#fIndexRotation can take).
    static sNumRotationIndexes = 4;

    // The colour of the 
    static sColourShadow = "#222222";
    
    // Offsets for the J, L, S, T, and Z blocks.
    static #sOffsetDataJLSTZ =
    [  
        [ new Vector2D(0,0), new Vector2D(0,0),  new Vector2D(0,0), new Vector2D(0,0) ],  // Offset 1
        [ new Vector2D(0,0), new Vector2D(1,0),  new Vector2D(0,0), new Vector2D(-1,0) ], // Offset 2
        [ new Vector2D(0,0), new Vector2D(1,1), new Vector2D(0,0), new Vector2D(-1,1) ], // Offset 3
        [ new Vector2D(0,0), new Vector2D(0,-2),  new Vector2D(0,0), new Vector2D(0,-2) ], // Offset 4
        [ new Vector2D(0,0), new Vector2D(1,-2),  new Vector2D(0,0), new Vector2D(-1,-2) ], // Offset 5
    ];
    
    // Offsets for the I block.
    static #sOffsetDataI =
    [  
        [ new Vector2D(0,0),  new Vector2D(-1,0), new Vector2D(-1,-1), new Vector2D(0,-1) ], // Offset 1
        [ new Vector2D(-1,0), new Vector2D(0,0),  new Vector2D(1,-1),  new Vector2D(0,-1) ], // Offset 2
        [ new Vector2D(2,0),  new Vector2D(0,0),  new Vector2D(-2,-1), new Vector2D(0,-1), ], // Offset 3
        [ new Vector2D(-1,0), new Vector2D(0,-1),  new Vector2D(1,0),  new Vector2D(0,1) ], // Offset 4
        [ new Vector2D(2,0),  new Vector2D(0,2), new Vector2D(-2,0), new Vector2D(0,-2) ],  // Offset 5

        [ new Vector2D(0,0),  new Vector2D(-1,-1), new Vector2D(0,0), new Vector2D(0,-2) ]  // Offset 6 (new)
    ];
    
    // Offset for the O block.
    static #sOffsetDataO =
    [ 
        //[new Vector2D(0,0), new Vector2D(0,-1), new Vector2D(-1,-1), new Vector2D(-1,0) ] // Offset 1
        [ new Vector2D(0,0), new Vector2D(0,1), new Vector2D(-1,1), new Vector2D(-1,0) ]
    ];
    
    // Clockwise rotation matrix.
    static #sMatrixRotCCW =
    [
        new Vector2D( 0, -1), // Column 1
        new Vector2D( 1,  0)  // Column 2
    ];
    
    // Anti-clockwise rotation matrix.
    static #sMatrixRotCW =
    [ 
        new Vector2D( 0, 1), // Column 1
        new Vector2D(-1, 0)  // Column 2
    ];
    
    
// Constructors (1) ====================================================================================================
    
    /* Constructor
     
     * Parameters:
         > a_type: the block's type.
    */
    constructor(aType = Block.Type.I, aPositions = undefined, aIndexRotation = 0)
    {
        if (aPositions && aPositions instanceof Array)
            this.#fPositions = aPositions.map(position => position.copy());
        else
            this.#fPositions = Array(Block.sNumTiles).fill(new Vector2D());
        
        this.#fIndexRotation = aIndexRotation;
        
        this.#fType = aType;
    }

    copy()
    {
        return new Block(this.#fType, this.#fPositions, this.#fIndexRotation);
    }
    
    
// Methods (9) =========================================================================================================

    Rotate180(aGrid)
    {
        this.Rotate(true, aGrid, true, true);

        return this.Rotate(true, aGrid, true, false);
    }

    /* Rotation Method
     * This method rotates the block in the given direction.
     * The rotation system is based on the Super Rotation System (SRS). For more information on how this system works, 
       particularly the offsets for each block, see https://tetris.fandom.com/wiki/SRS.
    
     * Parameters:
         > aClockwise: the direction of rotation.
         > aGrid: the grid on which the block is displayed.
         > aTryOffsets: a flag that, when true, indicates that the piece should be offset in the event that it cannot 
           be directly rotated into a valid position.
         
     * Return Value:
         > A boolean indicating whether or not the block was successfully rotated. 
    */
    Rotate(aClockwise, aGrid, aTryOffsets = true, aForceRotation = false)
    {
        if (aTryOffsets)
        { aGrid.UnDrawBlock(this); }
        
        // The current rotation index (pre-rotation).
        const lIndexRotationOld = this.#fIndexRotation;
        
        // Increment/decrement this.#fIndexRotation according to aClockwise.
        if (aClockwise)
        {
            this.#fIndexRotation = (this.#fIndexRotation + 1) % Block.sNumRotationIndexes;
        }
        else
        {
            this.#fIndexRotation = (this.#fIndexRotation == 0) ? Block.sNumRotationIndexes - 1 : this.#fIndexRotation - 1;
        }
        
        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            this.RotateTilePosition(0, i, aClockwise);
        }
        
        if (!aTryOffsets)
        { return false; }

        //console.log("Attempted Coordinates of Block Rotation: " + this.#fPositions);
        // Try to find a valid placement for the block by using the offset data (record result in lIsRotationPossible).
        const lIsRotationPossible = this.OffSet(lIndexRotationOld, this.#fIndexRotation, aGrid);

        // If the block can't be rotated (even after trying all available offsets), rotate back to the original 
        // position (unless the 'force' flag is set).
        if (!lIsRotationPossible && !aForceRotation)
        {
            this.Rotate(!aClockwise, aGrid, false);
        }

        if (!aForceRotation)
        {
            aGrid.DrawBlock(this);
        }

        return lIsRotationPossible;
    }
    
    /* Movement Method
     * This method moves the block by the given movement vector.
     * Note that, assuming that the block can be moved, the position on the grid is updated.
     
     * Parameters:
         > aMovement: the vector that defines the movement.
         > aGrid: the grid on which the block is to be moved.
         > aUpdateGrid: a flag that, when true, indicates that the grid is to be updated: i.e. the block should 
                          actually be moved on the grid, as opposed to just its position array being altered.

     * Return Value:
         > This method returns true if the block was successfully moved; false if otherwise.
    */
    Move(aMovement, aGrid, aUpdateGrid)
    {
        if (aUpdateGrid)
        { aGrid.UnDrawBlock(this); }
        
        let lCanMove = true;
        
        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            if (!this.CanMoveTilePosition(i, aMovement, aGrid))
            {
                //System.out.println("Invalid movement!");
                lCanMove = false;
                break;
            }
        }
        
        if (lCanMove)
        {
            for (let i = 0; i < this.#fPositions.length; ++i)
            {
                this.#fPositions[i].PlusEquals(aMovement);
            }
        }
        
        if (aUpdateGrid)
        { aGrid.DrawBlock(this, false); }
        
        return lCanMove;
    }

    Drop(aGrid, aDrawShadow = true)
    {
        aGrid.UnDrawBlock(this, aDrawShadow);

        let lLengthDrop = 0;

        // Drop the block.
        while(this.Move(Vector2D.s_up, aGrid, false))
            ++lLengthDrop;

        aGrid.DrawBlock(this, aDrawShadow);

        return lLengthDrop;
    }

    /*
    * Moves the block as far as possible in the given direction.
    * Returns the length of the shift: i.e. how many times it moved.

    * Parameters:
        > aGrid: the grid on which to move the block. The block should already be on the grid.
        > aDirection: the direction in which to move. This should be a Vector2D object with a magnitude of 1: use the 
          static fields defined in Vector2D (i.e. s_up, s_down, s_left, and s_right).
        > aDrawShadow: whether or not the block's 'shadown' should also be drawn.
    */
    Shift(aGrid, aDirection = Vector2D.s_up, aDrawShadow = true)
    {
        aGrid.UnDrawBlock(this, aDrawShadow);

        let lLengthShift = 0;

        // Drop the block.
        while(this.Move(aDirection, aGrid, false))
            ++lLengthShift;

        aGrid.DrawBlock(this, aDrawShadow);

        return lLengthShift;
    }
    
    /*
     * This method returns true if the block can be moved in the given direction; false if otherwise. 
    */
    CanMove(aMovement, aGrid)
    {
        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            if (!this.CanMoveTilePosition(i, aMovement, aGrid))
            {
                //System.out.println("Invalid movement!");
                return false;
            }
        }
        
        return true;
    }
    
    /*
     * This method returns the colour associated with the block's type. 
    */
    GetColour()
    {
        return this.#fColour ? this.#fColour : Block.Colours[this.#fType];
    }
    
    
// (d)(i). Accessors (2) -----------------------------------------------------------------------------------------------
    
    /* Accessor of this.#fType
    */
    get type()
    {
        return this.#fType;
    }
    
    /* Accessor of f_position.
    */
    get position()
    {
        return this.#fPositions;
    }

    /* Accessor of f_position.
    */
    get indexRotation()
    {
        return this.#fIndexRotation;
    }
    
    
// (d)(ii). Mutators (1) -----------------------------------------------------------------------------------------------
    
    set type(aType)
    {
        this.#fType = aType;
    }

    set indexRotation(aIndex)
    {
        this.#fIndexRotation = aIndex;
    }

    /* Mutator of this.#fPositions
     * This method sets the block's position in accordance with the given coordinate.
     
     * Parameters:
         > aPos: the coordinate at which the block's origin coordinate (this.#fPositions[]) is set.
    */
    set position(aPos)
    {
        // Set the position of the 'centre piece'.
        this.#fPositions[0] = aPos.copy();
        
        // Set the positions of the other (three) tiles.
        switch (this.#fType)
        {
            case Block.Type.I :
                // |/||/||/||/|
                //  1  0  3  2
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(2,0));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;
                
            case Block.Type.J :
                // |/|
                //  2
                // |/||/||/|
                //  1  0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(-1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;
                
            case Block.Type.L :
                //       |/|
                //        2
                // |/||/||/|
                //  3  0  1
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                break;
                
            case Block.Type.O :
                // |/||/|
                //  3  2
                // |/||/|
                //  0  1 
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                break;
                
            case Block.Type.S :
                //    |/||/|
                //     2  3
                // |/||/|
                //  1  0 
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                break;
                
            case Block.Type.T :
                //    |/|
                //     2 
                // |/||/||/|
                //  1  0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;
                
            case Block.Type.Z :
                // |/||/|
                //  2  1
                //    |/||/|
                //     0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(-1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;

            default :
                console.log("Unknown Block");
        }

        // The number of times the block must be rotated (the block is set to the 0th rotation position above).
        const lNumRotations = this.#fIndexRotation;

        for (let i = 0; i < lNumRotations; ++i)
        {
            for (let j = 0; j < this.#fPositions.length; ++j)
            {
                this.RotateTilePosition(0, j, true);
            }
        }

    }

    set colour(aColour)
    {
        this.#fColour = aColour;
    }
    
    changeRotationIndex(aClockwise)
    {
        // Increment/decrement this.#fIndexRotation according to aClockwise.
        if (aClockwise)
        {
            this.#fIndexRotation = (this.#fIndexRotation + 1) % Block.sNumRotationIndexes;
        }
        else
        {
            this.#fIndexRotation = (this.#fIndexRotation == 0) ? Block.sNumRotationIndexes - 1 : this.#fIndexRotation - 1;
        }
    }
    
// (e). Auxiliaries (3) ================================================================================================
    
    /* Auxiliary of Rotate
     * Rotates a coordinate in this.#fPositions.
     
     * Parameters:
         > aIndexOrigin: the index of this.#fPositions corresponding to the coordinate that is considered the block's 
           origin/centre.
         > aIndexPos: the index of this.#fPositions of the coordinate to be rotated about the coordinate at aIndexOrigin.
         > aClockwise: a flag that, when true, indicates that the coordinate should be rotated clockwise.
    */
    RotateTilePosition(aIndexOrigin, aIndexPos, aClockwise)
    {
        // The position of this.#fPositions[aIndexPos] relative to this.#fPositions[aIndexOrigin].
        const l_position_relative = this.#fPositions[aIndexPos].Minus(this.#fPositions[aIndexOrigin]);
        
        // The new position associated with index aIndexPos.
        const l_position_new = new Vector2D();
        
        // The rotation matrix necessary to 
        const l_matrix_rot = aClockwise ? Block.#sMatrixRotCW : Block.#sMatrixRotCCW;
        
        // Rotate the X position of l_position_relative (store result in l_position_new).
        l_position_new.x = (l_matrix_rot[0].x * l_position_relative.x) + 
                           (l_matrix_rot[1].x * l_position_relative.y);
        
        // Rotate the Y position of l_position_relative (store result in l_position_new).
        l_position_new.y = (l_matrix_rot[0].y * l_position_relative.x) + 
                           (l_matrix_rot[1].y * l_position_relative.y);
        
        // Make l_position_new relative to the universal origin, not the relative origin this.#fPositions[aIndexOrigin].
        l_position_new.PlusEquals(this.#fPositions[aIndexOrigin]);
        
        // Set the new position.
        this.#fPositions[aIndexPos] = l_position_new;
    }
    
    /* Auxiliary of Rotate
     * This method offsets the block's position in accordance to the old and new rotation indexes.
     
     * Parameters:
         > aIndexRotationOld: the rotation index prior to rotation.
         > aIndexRotationNew: the rotation index post rotation (i.e. the current rotation index).
         > aGrid: the grid on which the block is displayed.
     
     * Return Value:
         * This method returns true if the piece was successfully offset into a new position; false if otherwise. 
    */
    OffSet(aIndexRotationOld, aIndexRotationNew, aGrid)
    {
        // The offset vector for lIndexRotationOld, l_index_rotation_new, and the relative offset, respectively.
        let l_offset_old, l_offset_new, l_offset_relative;
        
        // The offset data used to determine the values of the above offsets.
        let l_offset_data;
        
        if (this.#fType === Block.Type.O)
        { l_offset_data = Block.#sOffsetDataO; }
        else if (this.#fType === Block.Type.I)
        { l_offset_data = Block.#sOffsetDataI; }
        else
        { l_offset_data = Block.#sOffsetDataJLSTZ; }

        let l_index_offset = 0;

        for(const offsetDataI of l_offset_data)
        {
             // Get the offset vector for indexOffset associated with lIndexRotationOld and l_index_rotation_new, respectively.
             l_offset_old = offsetDataI[aIndexRotationOld];
             l_offset_new = offsetDataI[aIndexRotationNew];
             
             // Calculate the relative offset between the old and new rotation indexes.
             l_offset_relative = l_offset_old.Minus(l_offset_new);
             
             if (this.Move(l_offset_relative, aGrid, false))
             {
                //  console.log("============================================================");
                //  console.log("Offset Data Index: " + l_index_offset);
                //  console.log("Roation Indexes: " + aIndexRotationOld + " to " + aIndexRotationNew);
                //  console.log("Offset Vector: " + l_offset_relative);
                 return true;
             }

            if (l_index_offset == 5)
            {
                // console.log("============================================================");
                // console.log("5 didn't work");
                // console.log("Offset Data Index: " + l_index_offset);
                // console.log("Roation Indexes: " + aIndexRotationOld + " to " + aIndexRotationNew);
                // console.log("Offset Vector: " + l_offset_relative);
            }

            ++l_index_offset;
        }
        
        return false;
    }
    
    /* Auxiliary of Move
     * If this.#fPositions[aIndexPos] can be moved according to aMovement, true is returned; otherwise, false.
      
     * Parameters:
         > aIndexPos: the index of the coordinate in this.#fPositions that is to be moved.
         > aMovement: the way in which to move the coordinate.
         > aGrid: the grid on which the block is displayed.
         
      * Return Value:
         * This method returns true if the coordinate can be moved; false if otherwise.  
         
    */
    CanMoveTilePosition(aIndexPos, aMovement, aGrid)
    {
        const lPositionPostMove = this.#fPositions[aIndexPos].Plus(aMovement);
        
        return aGrid.CanBeMovedTo(lPositionPostMove);
    }

// Static Methods (1) ==================================================================================================

    static getRandomType()
    {
        const lKeys = Object.keys(Block.Type);
        return lKeys[utils.GetRandom(0, lKeys.length - 1)];
    }
    
}

export default Block;
