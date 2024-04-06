const Board = artifacts.require("Board");

module.exports = function (callback) {
    Board.deployed().then(async function(instance) {
        // Log contract address
        try {
            console.log("Contract address:", instance.address);
            const col = await instance.getColour(0, 0);
                
            console.log("Colour", col);
            
            callback();
        }
        catch (error) {
            console.error("Error:", error);
            
            callback(error);

        }
                
    }).catch(function(error) {        
        console.error("Error:", error);
        callback(error);
    });
};
