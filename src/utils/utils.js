/*
* This function returns a random number between aMin and aMax (inclusive of both, i.e. [aMin, aMax]).

* Parameters:
    > aMin: the minimum value of the random number.
    > aMax: the maximum value of the random number.
*/
function GetRandom(aMin, aMax)
{
    return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
}

/*
* Randomises the order of the given array.

* Parameters:
    > aArray: the array to randomise.
*/
function RandomiseArray(aArray)
{
    if (!Array.isArray(aArray))
    {
        console.log("The parameter is not an array.");
        return;
    }

    for (let i = aArray.length - 1; i > 0; --i)
    {
        const lIndexRandom = GetRandom(0, i);

        let lValueI = aArray[i];
        aArray[i] = aArray[lIndexRandom];
        aArray[lIndexRandom] = lValueI;
    }

}

function SetInLocalStorage(aKey, aValue)
{
    if (aValue instanceof Map)
    {
        console.log("Storing a map in local storage.");

        localStorage[aKey] = JSON.stringify(Array.from(aValue));
    }
    else
    {
        localStorage[aKey] = JSON.stringify(aValue);
    }

}

/*
* Retrieves data from device's internal storage.

* Parameters:
    > aKey: the key that corresponds to the data.
    > aAlt: the value that will be returned should the key have no corresponding value.
*/
function GetFromLocalStorage(aKey, aAlt = "")
{
    if (!localStorage.hasOwnProperty(aKey))
    {
        console.log("localStorage doesn't contain data associated with this key.");
    }

    const lString = localStorage[aKey];

    return lString ? JSON.parse(lString) : aAlt;
}

/*
* 'Debounces' a function.
* The minimum gap between calls to pFunc is guaranteed to be at least pLengthGap.
* See 'https://www.freecodecamp.org/news/javascript-debounce-example/' for a more in-depth explanation.

* Parameters:
    > aKey: the function to be debounced.
    > pLengthGap: the minimum gap between calls to pFunc.
*/
function Debounce(pFunc, pLengthGap)
{
    let lTimer;

    return (...args) => 
    {
      clearTimeout(lTimer);

      lTimer = setTimeout(() => { pFunc.apply(this, args); }, pLengthGap);
    };
}

/*
* Returns an end-padded version of the given array.
* The returned array contains the same data as the one supplied to the function, with additional elements (equal to
  pFillValue) padded to the end. 

* Parameters:
*/
function PadEndArray(pArray, pMinLength, pFillValue)
{
    if (pArray.length >= pMinLength)
        return;

    return Object.assign(new Array(pMinLength).fill(pFillValue), pArray);
}

function OrdinalSuffix(aNum)
{
    if (typeof aNum !== 'number')
        return;

    const lNumAbs = Math.abs(aNum);

    if (lNumAbs > 3 && lNumAbs < 21)
        return "th";
    
    const lNumMod10 = lNumAbs % 10;

    if (lNumMod10 === 1)
        return "st";
    else if (lNumMod10 === 2)
        return "nd"
    else if (lNumMod10 === 3)
        return "rd"
    else
        return "th";
}

// An 'enum' for representing comparison operators.
const CompOps = Object.freeze(
    {
        E: 0,  // Equals (===)
        NE: 1, // Not Equals (!==)
        G: 2,  // Greater (>)
        L: 3,  // Less than (<)
        GE: 4, // Greater or Equal (>=)
        LE: 5  // Less than or Equal (<=)
    });

const utils =
{
    GetRandom: GetRandom,
    RandomiseArray: RandomiseArray,
    SetInLocalStorage: SetInLocalStorage,
    GetFromLocalStorage: GetFromLocalStorage,
    Debounce: Debounce,
    PadEndArray: PadEndArray,
    OrdinalSuffix: OrdinalSuffix,
    CompOps: CompOps
};

// Export functions.
export { utils as default };
