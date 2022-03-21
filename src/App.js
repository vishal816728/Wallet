import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createSearchParams } from "react-router-dom";
import Web3 from "web3";
import loadcontract from "./utils/load-contract";

import "./App.css";
function App(){
  const [Web3Api,setWeb3Api]=useState({
    provider:null,
    Web3:null,
    contract:null
  }) 
  const [Mode,setMode]=useState({
    color:"black",
    backgroundColor: "white"
  })
  const [buttonName,setButtonName]=useState('Dark Mode')



  const [account,setaccounts]=useState(null)
  const [Balance,setBalance]=useState(null)

  const setAccountChannge=(provider)=>{
          provider.on("accountsChanged",(accounts)=>{setaccounts(accounts[0])
  })}
    useEffect(()=>{
      const loadprovider=async ()=>{
        let provider=null
        try{

        
        
        if(window.ethereum){
          provider=window.ethereum
          setAccountChannge(provider)
          try{
            await provider.request({ method: 'eth_requestAccounts' })
          }catch(err){
            console.log(err)
          }
        }else if (window.Web3){
          provider=window.Web3.currentProvider
        }else if (!process.env.production){
          provider=window.Web3.provider.HTTPProvider("HTTP://127.0.0.1:7545")
        }
        const contract=await loadcontract("Migrations",provider)
        setWeb3Api({
          Web3:new Web3(provider),
          provider,
          contract
        })}catch(error){
          console.log(error)
        }
        // console.log(window.ethereum)
        // console.log(window.web3)
      }
   
      loadprovider()
    },[])

    useEffect(()=>{
      const {contract,Web3} =Web3Api
         const loadBalance=async()=>{
           try{
            console.log(contract)
            const balance1=await Web3.eth.getBalance(contract.address)
            setBalance(Web3.utils.fromWei(balance1,"ether")) 
           }catch(err){
             console.log(err)
           }
           }
        Web3Api.contract && loadBalance()
    },[Web3Api])
    useEffect(()=>{
      const getAccounts=async()=>{
        const accounts=await Web3Api.Web3.eth.getAccounts()

        setaccounts(accounts[0])
      }
       Web3Api.Web3 && getAccounts()
    },[Web3Api.Web3])
     

    const addfunds=async()=>{
      const {contract,Web3}=Web3Api
      await contract.addfunds({
        from:account,
        value:Web3.utils.toWei("1","ether")
      })
      window.location.reload()
    }

    const withdraw=async()=>{
      const {contract,Web3}=Web3Api
      await contract.withdraw(Web3.utils.toWei("0.1","ether"),{
        from:account
        
      })
      window.location.reload()
    }
    

    const toggleMode=()=>{
      if(Mode.color==="black"){
        setMode({
          color:"white",
          backgroundColor:"black"
        })
        setButtonName("Light Mode") 
      }else{
          setMode({
            color:"black",
            backgroundColor:"white"
          })
          setButtonName("Dark Mode")
        }
      }
    // }
    return (
      <div className="App" style={Mode}>
        <div className="App_container ">
          <div className="acoountbutton">
           <h1 className="alignh1">Account:&nbsp;&nbsp;&nbsp;<span>{account?account:
           !Web3Api.provider?
           <div><small>Wallet is Not Detected</small>
           <a href="http://docs.metamask.io" target="_blank">Install MetaMask</a></div>:<button
           className="button is-light is-success"
           onClick={()=>{
             Web3Api.provider.request({method:"eth_requestAccounts"})
           }} >
               connect to wallet
           </button>}</span></h1>
           </div>
          <div className="App_content is-size-2" style={Mode}>
            <h1>Current Balance:<strong style={Mode}>&nbsp;{Balance}</strong>Eth</h1>
          </div>
          <div className="App_buttons m-2">
            <button className="button is-dark mr-2"
            onClick={addfunds}
            >Contribute</button>
            <button className="button is-dark"
              onClick={withdraw}
            >Withdraw</button>
            <button onClick={
               async()=>{
                 try{
                 const accounts=await window.ethereum
                   .request({ method: 'eth_requestAccounts' })

                 }catch(error){
                  if (error.code === 4001) {
                   console.log('Please connect to MetaMask.');
                 } else {
                    console.error(error);
                    }
                 }
               }
            } className="button is-info ml-2">Enable Ethereum</button>
          </div>
        </div>
        <div className="is-justify-content-flex-end">
        <button className="button mt-5 is-dark is-light" 
             onClick={toggleMode}
        >{buttonName}</button>
        </div>
      </div>
    );
  }


export default App;
