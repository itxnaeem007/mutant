import React , {useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector'
import useAuth from './hook/useAuth'
import useWeb3 from './hook/useWeb3'
import ContractABI from './utils/abi/abiSmart.json';
import { toast } from "react-toastify";

import './RenderHeader.css';

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 97]
})
const RenderHeader = (props) => {
    const {Header} =props
    const { login } = useAuth()
    const { account, chainId } = useWeb3React()
    const webThree = useWeb3();

    let [mintValue, setMintValue] = useState(1)
    const [loading , setLoading ] = useState(false)

    const getContract = async () => {  
        const contract = new webThree.eth.Contract(ContractABI, '0xF839f36391D0328B04dEBa3988dD72105E92B7AD');
        return contract
    };

    const fetchTotalSupply =async (value) => {
        debugger
        let check = false
        const contract = await getContract()
        let res = await contract.methods.totalSupply().call({from:account})
        if(value > 0){
            if(res < 500){
                if(res <= 497){
                    if(value < 4){
                        check = true
                    }else{
                        check = false
                        toast.info('You Can only mint 3 In free collection')
                    }
                }else{
                    let temp = 500 - res ;
                    if(value > temp){
                        check = false;
                        toast.info('You Can only mint ' + temp + " In free collection")
                    }else{
                        check = true;
                    }
                }
            }else{
               if(value <= 20){
                check = true;
               }else{
                check = false
                toast.info('You Can only mint 20 In Paid collection')
               }
            }
        }else{
            check = false
            toast.info("Kindly enter postive amount")

        }
        return check;

    }

    const mint =async () => {
        setLoading(true)
        const valid = await fetchTotalSupply(mintValue)
        if(valid){
            toast.info('Minting Start')
            let totalAmount = 0.02;
             const amount = webThree.utils.toWei(totalAmount.toString(), 'ether')
    
             const contract = await getContract()
             
             console.log(contract);
         
            //  await contract.methods.transfer('0x707db038c846d30401d25dbbdc4ace67c6585f57', amount).send({from: '0x3Ed0E4C21D742b6903828Bcdd4F802CDfD7dFEeb'})
            try {
                let res = await contract.methods.totalSupply().call({from:account})
                if(res > 500){
                    await contract.methods.mint(mintValue).send({from:account ,value: amount})
                }else{
                    await contract.methods.mint(mintValue).send({from:account})
                }
                localStorage.setItem('minted' , res)
                toast.info('Token minted Successfully')
    
                setLoading(false)
            } catch (error) {
                setLoading(false)
                if (error.code === 4001) {
                    toast.error('User Reject transaction')
                }else{
                    toast.error('Transaction Fail')
                }
    
            }
        }else{
            setLoading(false)

        }
        
   
    }

    return (
        <div className='render-header'>
            <img src={Header} alt="Logo" style={{ 'width': '100%' }} />
            {/* {account ?
            <>
            <input className='header-input' value={mintValue}  type="number" placeholder='Enter mint' onChange={(e)=>{
             setMintValue(e.target.value)
            }} />
                    <button className='header-button' onClick={()=>{
                        if(!loading){
                            mint()
                        }
                    }} >{loading? "Loading..." : "Mint"}</button>
                    </>
                :
                <button className='header-button' onClick={() => { login(injected) }}>CONNECT</button>} */}
        </div>
    );
}

export default RenderHeader;