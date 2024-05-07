const { ethers } = require("ethers");
const contractArtifact = require("../build/contracts/Board.json");
const network_port = 5777;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask not installed");
    return;
  }
  userSetup();
  boardSetup();
}

async function userSetup() {
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.log(error);
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accounts = await signer.getAddress();
  const balance = await provider.getBalance(accounts);
  let balanceSimple = ethers.utils.formatEther(balance);

  let userMessage = `<p> ${accounts} <br> ${balanceSimple} </p>`;
  document.getElementById("userDiv").innerHTML = userMessage;
}

async function boardSetup() {
  let contractAddress = contractArtifact.networks[network_port].address;
  const abi = contractArtifact.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  let board = document.getElementById("board");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      try {
        let cell = document.createElement("div");
        cell.className = "cell";
        let c = await contract.getColour(i, j);

        let rgbColour = c.toNumber();
        let RGB = `#${rgbColour.toString(16)}`;

        cell.id = `${i}${j}`;
        cell.style.backgroundColor = RGB;
        board.appendChild(cell);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function execute() {
  let contractAddress = contractArtifact.networks[network_port].address;
  const abi = contractArtifact.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    let c = await contract.getColour(1, 1);
    console.log("HERE IS C", JSON.stringify(c));
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connect,
  execute,
};
