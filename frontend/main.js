let web3;

async function connectToMetamask() {
  //check if Metamask is installed
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    // Request the user to connect accounts (Metamask will prompt)
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Get the connected accounts
    const accounts = await web3.eth.getAccounts();

    // Display the connected account
    document.getElementById("connectedAccount").innerText = accounts[0];
  } else {
    alert("Please download Metamask");
  }
}

async function displayBalance() {
  let accounts = await web3.eth.getAccounts();
  for (let account of accounts) {
    let balance = await web3.eth.getBalance(account);

    document
      .getElementById("accountBalances")
      .insertAdjacentHTML("beforeend", `<li>${account} | ${balance}</li>`);
  }
}
