import React, { useEffect, useState } from 'react';
import useAuth from './hook/useAuth'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core';
import useWeb3 from './hook/useWeb3'
import ContractABI from './utils/abi/abiSmart.json';
import { toast } from "react-toastify";
import './Main.css'

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 97]
})
export const shortenAddress = (address, chars = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const Main = () => {
    const { login, logout } = useAuth()
    const { account, chainId } = useWeb3React()
    const [loading, setLoading] = useState(false)
    const [totalMinted, setTotalMinted] = useState(0)
    const webThree = useWeb3();
    let [mintValue, setMintValue] = useState(1)

    const getContract = async () => {
        const contract = new webThree.eth.Contract(ContractABI, '0xF839f36391D0328B04dEBa3988dD72105E92B7AD');
        return contract
    };

    // const calculateGasPrice = async (data) => {
    //     const transactionEstimate = {
    //       data: data,
    //       from: account
    //     }
    //     let gasPrice = null
    //     let priceEstimated = null
    //     try {
    //       gasPrice = await library.getSigner().provider.getGasPrice(transactionEstimate)

    //       // gasLimit = await library
    //       //   .getSigner()
    //       //   .provider.estimateGas(transactionEstimate)
    //     } catch (e) {
    //       console.log(e)
    //     }
    //     if (gasPrice) {
    //       priceEstimated = ethers.utils.parseUnits(
    //         Number(ethers.utils.formatUnits(gasPrice, 'gwei')).toString(),
    //         'gwei'
    //       )
    //     }
    //     return priceEstimated
    //   }

    let checkMinted = localStorage.getItem('minted')

    const getTotalSupply = async () => {
        const contract = await getContract()

        try {
            let res = await contract.methods.totalSupply().call({ from: account })

            setTotalMinted(res)
        } catch (error) {
        }

    }
    useEffect(() => {
        getTotalSupply()
    }, [])

    const fetchTotalSupplyCheck = async (value) => {
        let check = false
        const contract = await getContract()
        let res = await contract.methods.totalSupply().call({ from: account })
        if (value > 0) {
            if (+res < 500) {
                if (+res <= 497) {
                    if (value < 4) {
                        check = true
                    } else {
                        check = false
                        toast.info('You Can only mint 3 In free collection')
                    }
                } else {
                    let temp = 500 - +res;
                    if (value > temp) {
                        check = false;
                        toast.info('You Can only mint ' + temp + " In free collection")
                    } else {
                        check = true;
                    }
                }
            } else {
                if (value <= 20) {
                    check = true;
                } else {
                    check = false
                    toast.info('You Can only mint 20 In Paid collection')
                }
            }
        } else {
            check = false
            toast.info("Kindly enter postive amount")

        }
        return check;

    }

    const mint = async () => {
        setLoading(true)
        const valid = await fetchTotalSupplyCheck(mintValue)
        if (valid) {
            toast.info('Minting Start')
            let totalAmount = 0.02 * mintValue;
            const amount = webThree.utils.toWei(totalAmount.toString(), 'ether')
            const contract = await getContract()
            // let gas =  mintValue * 100000;


            // await contract.methods.mint(mintValue).estimateGas({ from: account }).then(function (gasAmount) {
            //     console.log('gasAmount' , gasAmount);
            //     gas = +gasAmount + (+mintValue * 100000) 

            // })
            // .catch(function (error) {

            // });

            console.log(contract);

            //  await contract.methods.transfer('0x707db038c846d30401d25dbbdc4ace67c6585f57', amount).send({from: '0x3Ed0E4C21D742b6903828Bcdd4F802CDfD7dFEeb'})
            try {
                let res = await contract.methods.totalSupply().call({ from: account })
                if (+res >= 500) {
                    await contract.methods.mint(mintValue).send({ from: account, value: amount })
                } else {
                    await contract.methods.mint(mintValue).send({ from: account })
                }
                localStorage.setItem('minted', res)
                toast.info('Token minted Successfully')
                getTotalSupply()
                setLoading(false)
            } catch (error) {
                setLoading(false)
                if (error.code === 4001) {
                    toast.error('User Reject transaction')
                } else {
                    toast.error('Transaction Fail')
                }

            }
        } else {
            setLoading(false)

        }


    }
    return (
        <div className='main' id="main">
            <p className='main-p'>{totalMinted} / 6666</p>
            <p className='main-p-link'><a target="_blank" href={`https://etherscan.io/address/0xF839f36391D0328B04dEBa3988dD72105E92B7AD`}>0xF839f36391D03...</a></p>
            <p className='main-p-same'>1 Mutant Ape Costs .02 eth</p>
            <p className='main-p-same'>First 500 Mutant Apes are free!</p>
            <p className='main-p-simple'>Excluding gas fees.</p>
            <p className='main-p-simple'>Connect to the Ethereum network</p>
            <p className='main-p-simple'>Max mint 3 per transaction (For free mints)</p>
            <p className='main-p-simple'>Max mint 20 per transaction (For paid mints)</p>


            {account ?
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>

                        <input className='main-button' value={mintValue} type="number" placeholder='Enter mint' onChange={(e) => {
                            setMintValue(e.target.value)
                        }} />
                        <button className='main-button' onClick={() => {
                            if (!loading) {
                                mint()
                            }
                        }} >{loading ? "Loading..." : "Mint"}</button>
                    </div>
                    {/* <div>
                        <button className='main-button' >{shortenAddress(account)}</button>
                        <button className='main-button' onClick={() => { logout() }} >Logout</button>
                    </div> */}

                </div>
                :
                <button className='main-button' onClick={() => { login(injected) }}>CONNECT</button>}
        </div>
    );
}

export default Main;