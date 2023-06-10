import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoEthereumProviderError } from '@web3-react/injected-connector'
import { useCallback , useEffect } from 'react'
import { toast } from "react-toastify";
import { setupNetwork } from "./../utils/wallet";

const useAuth = () => {
  const { activate, deactivate , account , error} = useWeb3React()


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setupWalletNetworkOnActivate = () => {
    localStorage.setItem("publicKey", account);
  };

  useEffect(() => {
    async function checkWalletNeedSetup() {
      const isWalletNeedSetup = (await localStorage.getItem("needSetup")) || "";
      if (isWalletNeedSetup === "1" || isWalletNeedSetup === 1 ) {
        try {
          setupWalletNetworkOnActivate();
        } catch (error) {
        } finally {
          await localStorage.setItem("needSetup", "");
        }
      }
    }

    checkWalletNeedSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, error]);


  const login = useCallback(async (injected) => {
    const hasSetup = await setupNetwork(1);
    if (hasSetup) {
      await activate(injected).then((res) => {
        if (!account) {
          localStorage.setItem(
            "needSetup",
            4,
          );
          return;
        }
        toast.info("Wallet Connected")

        setupWalletNetworkOnActivate();
      });
    } else {
      toast.error("Kindly install or refresh Metamask extension")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },
    [account, activate, setupWalletNetworkOnActivate],
  );

  const logout = useCallback(() => {
    deactivate();
    localStorage.clear()
    toast.info("User Logout")

  }, [deactivate])

  return { login, logout }
}

export default useAuth
