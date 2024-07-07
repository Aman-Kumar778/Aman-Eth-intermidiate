import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage("MetaMask wallet is required to connect");
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
      let tx = await atm.deposit(ethers.utils.parseEther("0.01"));
      await tx.wait();
      getBalance();
    }
  };

  const dummydeposit = async () => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther("0.01"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther("0.01"));
      await tx.wait();
      getBalance();
    }
  };

  // a function to get the owner of the contract
  const getOwner = async () => {
    if (!atm) {
      setAlertMessage("ATM contract is not initiated.");
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      // Perform a small deposit transaction
      const owner = await atm.owner();
      setAlertMessage(`The Owner of the contract is: ${owner}`);
    } catch (error) {
      console.error(
        "Failed to connect or get details of owner of the contract",
        error
      );
      setAlertMessage("Failed to get the owner of the contract.");
    }
  };

  const checkNetwork = async () => {
    if (!ethWallet) {
      setAlertMessage("MetaMask wallet is required to connect");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethWallet);
    const network = await provider.getNetwork();

    if (network.chainId !== 31337) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAlertMessage("Please connect to the Ethereum Mainnet");
    } else {
      try {
        // Perform a small deposit transaction
        await new Promise((resolve) => setTimeout(resolve, 8000));
        setAlertMessage("You are connected to the Ethereum Mainnet");
      } catch (error) {
        console.error("Failed to perform a dummy transaction", error);
        setAlertMessage("Failed to perform a dummy transaction.");
      }
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

        <button
          onClick={() => {
            dummydeposit();
            getOwner();
          }}
        >
          Get Owner
        </button>
        <button
          onClick={() => {
            dummydeposit();
            checkNetwork();
          }}
        >
          Check Network
        </button>

        {alertMessage && <p>{alertMessage}</p>}
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
        <h2>Here, you can Deposit, Withdraw or check your ETH network</h2>
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
