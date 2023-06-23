/*
* A two-dimensional vector class.

* Composition:
    > Fields (6)
        - Static Fields (4)
    > Constructors (2)
    > Methods (11)
        - Accessors (2)
        - Mutators (2)
*/
class Vector2D
{
     
// (a). Fields (2) =====================================================================================================

    /*
    * The vector's x-coordinate.
    */
    #fX;

    /*
    * The vector's y-coordinate.
    */
    #fY;

// Static Fields (4) ---------------------------------------------------------------------------------------------------
    
    /* Static Instances
    * These are static instances of the class that are useful for a variety of situations.
    */
    static s_down = new Vector2D(0, -1);
    static s_up = new Vector2D(0, 1);
    static s_left = new Vector2D(-1, 0);
    static s_right = new Vector2D(1, 0);
    
    
// Constructors (2) ====================================================================================================
    
    /*
     * Parameters:
         > aX: The vector's x-coordinate.
         > aY: The vector's y-coordinate.
    */
    constructor(aX = 0, aY = 0)
    {
        // The vector's x and y coordinates.
        this.#fX = aX;
        this.#fY = aY;
    }

    copy()
    {
        return new Vector2D(this.#fX, this.#fY);
    }
    
    
// Methods (11) ========================================================================================================
    
    /*
     * This method returns the vector's magnitude. 
    */
    Magnitude()
    {
        return Math.sqrt(Math.pow(this.#fX, 2.0) + Math.pow(this.#fY, 2.0));
    }
    
    /*
     * This method calculates and returns the dot product of this vector and the one supplied. 
    */
    DotProduct(aRHS)
    {
        return this.#fX * aRHS.#fX + this.#fY * aRHS.#fY;
    }
    
    // += operator
    PlusEquals(aRHS)
    {
        this.#fX += aRHS.#fX;
        
        this.#fY += aRHS.#fY;
    }
    
    // -= operator.
    MinusEquals(aRHS)
    {
        this.#fX -= aRHS.#fX;
        
        this.#fY -= aRHS.#fY;
    }
    
    // + operator.
    Plus(aRHS)
    {   
        const lSum = new Vector2D();
        
        lSum.x = this.#fX + aRHS.x;
        lSum.y = this.#fY + aRHS.y;
        
        return lSum;
    }
    
    // - operator.
    Minus(aRHS)
    {
        const lDifference = new Vector2D();
        
        lDifference.#fX = this.#fX - aRHS.#fX;
        lDifference.#fY = this.#fY - aRHS.#fY;
        
        return lDifference;
    }
    
    /*
     * This method returns the vector's string representation.
    */
    toString()
    {
        return `(${this.#fX}, ${this.#fY})`;
    }
    
    
// Accessors (2) -------------------------------------------------------------------------------------------------------
    
    /* Accesor of #fX
    */
    get x()
    {
        return this.#fX;
    }
    
    /* Accesor of #fY
    */
    get y()
    {
        return this.#fY;
    }
    
    
// Mutators (2) --------------------------------------------------------------------------------------------------------
    
    /* Mutator of #fX
    */
    set x(aX)
    {
        this.#fX = aX;
    }
    
    /* Mutator of #fY
    */
    set y(aY)
    {
        this.#fY = aY;
    }

}

export default Vector2D;