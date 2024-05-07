pragma solidity ^0.8.21;
import "truffle/console.sol";

contract Board {
    uint8 constant size = 10;
    uint256[size][size] public arr_colours;
    uint8[size][size] public arr_bets;

    // Events
    event ColourChange(uint8 _row, uint8 _col, uint256 colour);

    function placeBid(
        uint8 _bid,
        uint8 _col,
        uint8 _row,
        uint8 _red,
        uint8 _green,
        uint8 _blue
    ) public {
        // set colour for given position
        require(
            _red <= 255 && _green <= 255 && _blue <= 255,
            "RGB values must be between 0 and 255"
        );

        if (arr_bets[_row][_col] < _bid) {
            // [TODO] handle the funds
            arr_bets[_row][_col] = _bid;

            uint256 rgbColour = (uint256(_red) << 16) |
                (uint256(_green) << 8) |
                uint256(_blue);

            setColour(_col, _row, rgbColour);
        } else {
            console.log("NO CHANGE, bid too low");
            console.log("VAL", arr_bets[_row][_col]);
        }
    }

    function setColour(uint8 _col, uint8 _row, uint256 colour) private {
        // set colour for given position
        arr_colours[_row][_col] = colour;

        // Broadcast change
        emit ColourChange(_row, _col, colour);
    }

    function getColour(uint8 _col, uint8 _row) public view returns (uint256) {
        return arr_colours[_row][_col];
    }
}
