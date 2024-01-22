'use client';
import React, {useState, useEffect} from 'react'
import Web3Modal from 'web3modal';
import {ethers} from 'ethers';
import Image from 'next/image';
import './globals.css'

export default function Page() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState("");

  const failMessage = "Please install MetaMask & connect your MetaMask";
  const successMessage = "Your Account Successfully connected to MetaMask";

  const key = '5aa5d07e82e34e9e92b98fef3418d763';
  const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${key}`);

  const checkIfWalletConnected = async() => {
    if(!window.ethereum) return;

    const accounts = await window.ethereum.request({method: "eth_accounts"});
    
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      console.log(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      const showBalance = `${ethers.formatEther(balance)}`
      setBalance(showBalance);
    } else {
      console.log("Fail");
    }
  };

  const CWallet = async() => {
    if(!window.ethereum) return console.log(failMessage);
    const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
    setCurrentAccount(accounts[0]);
    window.location.reload();
  }

  useEffect(()=>{
    checkIfWalletConnected();
    const options = {
      address: '0xe688b84b23f322a994A53dbF8E15FA82CDB71127 ',
      fromBlock: 0, // Starting block
      toBlock: 'latest', // Ending block (or 'pending' for pending transactions)
    };
    
    provider.getLogs(options)
      .then(logs => {
        console.log(logs);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(()=>{
    async function accountChanged() {
      window.ethereum.on('accountsChanged', async function(){
        const accounts = await window.ethereum.request({method: "eth_accounts"});

        if(accounts.length){
          setCurrentAccount(accounts[0]);
        } else {
          window.location.reload();
        }
      });
    }
    accountChanged();
  }, []);

  return (
    <div className='card-container'>
      {!currentAccount ? "" : <span className='pro'>PRO</span>}
      <Image className='creator' src={'/creator.png'} alt='profile' width={80} height={80}/>
      <h3>Check Ether</h3>

      {!currentAccount ? (
        <div>
          <div>
            <p>{failMessage}</p>  
          </div>
          <Image src={'/ether.png'} alt='ether' width={100} height={100}/>
          <p>Welcome to ether account balance checker</p>
        </div>
      ) : (
        <div>
          <h6>Verified <span className='tick'>&#10004;</span></h6>
          <p>Ether account and balance Checker <br/> find account details</p>
          <div className='buttons'>
            <button className='primary ghost' onClick={() => {}}> Ether Account Deatils</button>
          </div>
        </div>
      )}
      
      {!currentAccount && !connect ? (
        <div className='buttons'>
          <button className='primary' onClick={() => CWallet()}>Connect Wallet</button>
        </div>
      ) : (
        <div className='skills'>
          <h6>Your Ether</h6>
          <ul>
            <li>Accounts</li>
            <li>{currentAccount}</li>
            <li>Balance</li>
            <li>{balance}</li>
          </ul>
        </div>
      )}
    </div>
  )
}
