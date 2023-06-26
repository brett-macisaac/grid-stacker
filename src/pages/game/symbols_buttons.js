import GridSymbol from '../../classes/GridSymbol';

const gridSymbols = {
    left: new GridSymbol('arrowLeftDouble'),
    right: new GridSymbol('arrowRightDouble'),
    leftMax: new GridSymbol('arrowLeftDoubleSplit'),
    rightMax: new GridSymbol('arrowRightDoubleSplit'),
    down: new GridSymbol('arrowDownDouble'),
    downMax: new GridSymbol('arrowDownDoubleSplit'),
    clockwise: new GridSymbol('clockwise'),
    anticlockwise: new GridSymbol('antiClockwise'),
    rotate180: new GridSymbol('reflectionX'),
    hold: new GridSymbol('blockHold')
}

export default gridSymbols