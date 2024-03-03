
const accountInput = document.querySelector('#accountNumber');
const checkBalanceButton = document.querySelector('#checkBalance');
const displayBalance = document.querySelector('#balance');
const sendButton = document.querySelector('#sendTx');
const toAccountInput = document.querySelector('#toAccountNumber');
const valueInput = document.querySelector('#amount');
const blockCountDisplay = document.querySelector('#blockCount');
const transactionList = document.querySelector('#transactions');

const rpc = new Web3('https://sepolia.infura.io/v3/3dba672872174b9587837971698b5a4c');


let accounts;

// Funktion för att kontrollera saldo
async function checkBalance() {
  try {

    if (typeof ethereum !== 'undefined') {
    
      accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      // Hämta balansen 
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [accountInput.value, 'latest']
      });

      // Konvertera balansen till ETH 
      const parsedBalanced = parseInt(balance) / Math.pow(10, 18);
      displayBalance.innerText = parsedBalanced;
    } else {
      console.log('Ethereum not detected');
    }

    // Hämta senaste blocket 
    const block = await rpc.eth.getBlock('latest');
    if (block == null) return;
    const transactions = block.transactions;
    if (transactions !== null) {
      displayHistory(transactions);
    }
  } catch (error) {
    console.log(error);
  }
}

// Eventlyssnare för knappar
checkBalanceButton.addEventListener('click', checkBalance);
sendButton.addEventListener('click', sendFunds);

// Funktion för att skicka ETH
async function sendFunds() {
  try {
    const amount = parseFloat(valueInput.value) * Math.pow(10, 18);
    let params = [{
      from: accountInput.value,
      to: toAccountInput.value,
      value: Number(amount).toString(16),
      gas: Number(21000).toString(16),
      gasPrice: Number(2500000).toString(16),
    }];

    // Skicka transaktion med Metamask
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: params,
    });
  } catch (error) {
    console.log(error);
  }
}

// Funktion för att hämta antalet block
async function getBlockCount() {
  try {
    // Hämta antalet senaste block från Ethereum-nätverket
    const latestBlock = await ethereum.request({
      method: 'eth_blockNumber'
    });
    const blockCount = parseInt(latestBlock, 16); 
    blockCountDisplay.innerText = blockCount;
  } catch (error) {
    console.log(error);
  }
}


getBlockCount();
