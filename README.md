## Eth Frontend Project - module 2

This project demostrate , how you can connect your Frontend with your Daaps. Also , gives many functionalities about how to conncet your wallet and deposit or withdraw from your account. Your can also check who is the owner and in which network u are working on.

## Description

This project is all about connecting your frontend with your smart contract and wallet i.e MetaMask. Here first we have written some function about how to connect your wallet , by using react useState (which helps to change the state of the program as the function works) and using its function to change its functionalities. Then we have created deposit and withdraw functions , where if the atm is found then it will get the balance according to the funciton call. Also fucntion like getOwner() and CheckNetwork() is also there , where u can get the details of the owner of the contract and the current network in which u are working right now. the network model works on the chain id , where u need to specify the id of the network . 

## Getting Started

### Installing

*To run this program, first you need to clone this repository into your local compile - git clone 
* then you need to follow these steps
* Inside the project directory, in the terminal type: npm i
*Open two additional terminals in your VS code
*In the second terminal type: npx hardhat node
*In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js


### Executing program

* to execute the program - In the first terminal, type npm run dev to launch the front-end.
```
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  // a function to get the owner of the contract
  const getOwner = async () => {
    if (!atm) {
      alert("Atm contract is not initiated here, so look after this");
      return;
    }
    try {
      const owner = await atm.owner();
      alert(`the Owner of the contract is : ${owner}`);
      return;
    } catch (error) {
      console.error(
        "Falied to connect or get details of owner of the contract ",
        error
      );
    }
  };

  const checkNetwork = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethWallet);
    const network = await provider.getNetwork();

    if (network.chainId !== 31337) {
      // Change  to your desired network's chainId
      alert(`Please connect to the Ethereum Mainnet`);
    } else {
      alert(`You are connected to the Ethereum Mainnet`);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>

        <br></br>

        <button onClick={getOwner}>Get Owner</button>
        <button onClick={checkNetwork}>Check Network</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Aman_Kumar ATM!</h1>
        <h2>Here, u can Deposit, Witdraw or check your eth network</h2>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}

```

now after the project get running in your localhost . then u need to connect to your metamast wallet first , make sure u are using your first harhhat eth private key . 
After connecting , you  can use the function or u can add your own in the code.

## Authors

Aman Kumar - student

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
