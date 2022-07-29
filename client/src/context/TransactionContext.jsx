import React,{useState,useEffect} from 'react';
import { ethers } from 'ethers'
import {contractABI,contractAddress} from '../utils/Constants'

export const TransactionContext = React.createContext();

const {ethereum } = window;

const getEtheriumContract = () =>{

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer)
    
   return transactionContract;
}

export const TransactionProvider=({children})=>{

    const [currentAccount,setCurrentAccount]=useState("")
    const [formData,setFormData]=useState({addressTo:'',amount:'',keyword:'',message:''})
    const [isLoading,setIsLoading]=useState(false)
    const [transactionCount,setTransactionCount]=useState(localStorage.getItem('transactionCount'))
    const [transaction,setTransaction]=useState([])

    const handleChange=(e,name)=>{
        setFormData((prevData)=>({...prevData,[name]:e.target.value}))
        // setFormData(...formData,{name:e.target.value})
    }
    const getAllTransactions=async()=>{
        try {
            if(!ethereum) return alert("Please install Metamask")

            const transactionContract = getEtheriumContract()

            const availalbleTransactions=await transactionContract.getAllTransactions()

            const structuredTransactions=availalbleTransactions.map((transaction)=>({
                addressTo : transaction.receiver,
                addressFrom : transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            setTransaction(structuredTransactions)

        } catch (error) {
            console.log(error)
        }
    }
    const sendTransaction=async()=>{
        try {
            if(!ethereum) return alert("Please install Metamask")
            const transactionContract = getEtheriumContract()

            const { addressTo, amount, keyword, message } = formData;
            const parsedAmount= ethers.utils.parseEther(amount)
            await ethereum.request({
                method:'eth_sendTransaction',
                params:[{
                    from:currentAccount,
                    to:addressTo,
                    gas:"0x5208",
                    value:parsedAmount._hex
                }]
            })
            console.log("here")
            const transactionHash= await transactionContract.addTransaction(addressTo,parsedAmount,message,keyword)
            setIsLoading(true);
            console.log(`Loading - : ${transactionHash.hash}`)
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`success - : ${transactionHash.hash}`)
            
            const transactionCount=await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())
            window.location.reload()

        } catch (error) {
            console.log(error)
            throw new Error("No etherium object")
        }
    }
    const  checkIfWalletIsConnected=async()=>{
    try {
        if(!ethereum ) return alert("Please install Metamask");

        const accounts= await ethereum.request({method:'eth_accounts'})
        if(accounts.length){
            setCurrentAccount(accounts[0])
        }
        else{
            console.log("No account Found");
        }
        
    } catch (error) {
        console.log(error)
        throw new Error("No etherium object")
    }
    }

    const connectWallet=async ()=>{
        try {
            if(!ethereum ) return alert("Please install Metamask");

            const accounts= await ethereum.request({method:'eth_requestAccounts'})    

            console.log("accounts[0] "+accounts[0])

            setCurrentAccount(()=>{accounts[0]})
            window.location.reload();
            

        } catch (error) {
            console.log(error)
            throw new Error("No etherium object")
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])
    return(
       <TransactionContext.Provider value={{isLoading,connectWallet,currentAccount,handleChange,formData,setFormData,sendTransaction,getAllTransactions,transaction}}>
        {children}
       </TransactionContext.Provider>
    )

}