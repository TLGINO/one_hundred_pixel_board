pragma solidity ^0.8.21;
import "truffle/console.sol";

contract Board {
    uint16 constant size = 10;
    // flattened 2d arrays
    uint256[size * size] public arr_colours;
    uint256[size * size] public arr_bids;
    string[size*size] public arr_messages;
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

    function placeBidMessage(uint8 _row, uint8 _col, uint256 _colour, string calldata _message) public payable {
        uint256 pos = _row * size + _col;
        require(
            _colour < 16777216, // = 16**6 = #ffffff
            "RGB values must be between 0 and 255"
        );
        require(
            arr_bids[pos] < msg.value,
            "Bid must be more than the current bid"
        );

        arr_messages[pos] = _message;

        // set bid for given position
        arr_bids[pos] = msg.value;

        // set colour for given position
        arr_colours[pos] = _colour;
        // Broadcast change
        emit ColourChange(_row, _col, _colour);
    }

    function getSize() public pure returns (uint16) {
        return size;
    }

    function getColours() public view returns (uint256[size * size] memory) {
        return arr_colours;
    }


    function getBid(uint8 _row, uint8 _col) public view returns (uint256) {
        uint256 pos = _row * size + _col;
        return arr_bids[pos];
    }

    function getMessage(uint8 _row, uint8 _col) public view returns (string memory) {
        uint256 pos = _row * size + _col;
        return arr_messages[pos];
    }
}

//     0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8
// 0xf8e81D47203A594245E36C48e151709F0C19fBe8
