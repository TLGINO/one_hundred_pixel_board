pragma solidity ^0.8.21;
import "truffle/console.sol";

contract Board {
    uint16 constant size = 10;
    // flattened 2d arrays
    uint256[size * size] public arr_colours;
    uint256[size * size] public arr_bids;
    address public owner;

    // ------------
    // Constructor

    constructor() {
        owner = msg.sender;
    }

    // ------------
    // Modifiers

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    // ------------
    // Events

    event ColourChange(uint8 _row, uint8 _col, uint256 colour);

    // ------------
    // Functions

    function placeBid(uint8 _row, uint8 _col, uint256 _colour) public payable {
        uint256 pos = _row * size + _col;
        require(
            _colour < 16777216, // = 16**6 = #ffffff
            "RGB values must be between 0 and 255"
        );
        require(
            arr_bids[pos] < msg.value,
            "Bid must be more than the current bid"
        );

        // set bid for given position
        arr_bids[pos] = msg.value;

        // set colour for given position
        arr_colours[pos] = _colour;
        // Broadcast change
        emit ColourChange(_row, _col, _colour);
    }

    function getSize() public view returns (uint16) {
        return size;
    }

    function getColours() public view returns (uint256[size * size] memory) {
        return arr_colours;
    }

    function getBid(uint8 _row, uint8 _col) public view returns (uint256) {
        uint256 pos = _row * size + _col;
        return arr_bids[pos];
    }
}
