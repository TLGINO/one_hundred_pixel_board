const { ethers } = require("ethers");
const contractArtifact = require("../build/contracts/Board.json");
const network_port = 5777;
var global_contract;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask not installed");
    return;
  }
  userSetup();
  formSetup();
  boardSetup();
}

function getContract() {
  if (global_contract != undefined) {
    return global_contract;
  }

  // let contractAddress = contractArtifact.networks[network_port].address;
  // const abi = contractArtifact.abi;
  let contractAddress = "0xbCFE9e893C744F0661806aD8148bBaf6fAED295f";
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const abi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint8", name: "_row", type: "uint8" },
        { indexed: false, internalType: "uint8", name: "_col", type: "uint8" },
        {
          indexed: false,
          internalType: "uint256",
          name: "colour",
          type: "uint256",
        },
      ],
      name: "ColourChange",
      type: "event",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "arr_bids",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "arr_colours",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint8", name: "_row", type: "uint8" },
        { internalType: "uint8", name: "_col", type: "uint8" },
      ],
      name: "getBid",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getColours",
      outputs: [
        { internalType: "uint256[100]", name: "", type: "uint256[100]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSize",
      outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint8", name: "_row", type: "uint8" },
        { internalType: "uint8", name: "_col", type: "uint8" },
        { internalType: "uint256", name: "_colour", type: "uint256" },
      ],
      name: "placeBid",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const signer = provider.getSigner();
  global_contract = new ethers.Contract(contractAddress, abi, signer);

  global_contract.on("ColourChange", (_row, _col, colour) => {
    updateCellColour(_row, _col, colour);
  });

  return global_contract;
}

async function formSetup() {
  document
    .getElementById("pixel-manage-form")
    .addEventListener("submit", bidCell);
}

async function userSetup() {
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.log(error);
  }

  // Good for debug, will remove later
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accounts = await signer.getAddress();
  const balance = await provider.getBalance(accounts);
  let balanceSimple = ethers.utils.formatEther(balance);

  let userMessage = `<p> ${accounts} <br> ${balanceSimple} </p>`;
  document.getElementById("userDiv").innerHTML = userMessage;
}

async function boardSetup() {
  let contract = getContract();
  let board = document.getElementById("board");

  let size = await contract.getSize();
  let arr_colours = await contract.getColours();

  document.documentElement.style.setProperty("--grid-size", size); // set css size dynamically

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let pos = i * size + j;

      let cell = document.createElement("button");
      cell.addEventListener("click", () => {
        cellSelect(cell, i, j);
      });
      cell.className = "cell";
      cell.id = `${i}_${j}`;

      let rgbColour = arr_colours[pos].toNumber();
      let RGB = `#${rgbColour.toString(16).padStart(6, "0")}`;

      cell.style.backgroundColor = RGB;
      board.appendChild(cell);
    }
  }
}

async function updateCellColour(row, col, colour) {
  let cell = document.getElementById(`${row}_${col}`);

  let rgbColour = colour.toNumber();
  let RGB = `#${rgbColour.toString(16).padStart(6, "0")}`;
  cell.style.backgroundColor = RGB;
}

async function cellSelect(cell, row, col) {
  // remove active class from all the other cells
  const cells = document.querySelectorAll(".cell");
  cells.forEach((c) => {
    c.classList.remove("active");
  });
  // add active class to current cell
  cell.classList.add("active");

  let contract = getContract();
  let current_bid = await contract.getBid(row, col);

  document.getElementById("pixel_current_bid").innerHTML = current_bid;
  document.getElementById("pixel_row").innerHTML = row;
  document.getElementById("pixel_col").innerHTML = col;
}

async function bidCell(event) {
  event.preventDefault();

  let row = document.getElementById("pixel_row").innerHTML;
  let col = document.getElementById("pixel_col").innerHTML;

  let formData = new FormData(event.target);
  let bidColour = formData.get("pixel_rgb");
  let bidAmount = Number(formData.get("pixel_bid"));

  let colour = parseInt(bidColour.slice(1, 7), 16);

  const contract = getContract();
  try {
    await contract.placeBid(row, col, colour, { value: bidAmount });
  } catch (error) {
    alert(error.data.data.reason);
  }
}

module.exports = {
  connect,
};
