import Networks from "./constants/network";

/**
 * Prompt the user to add BSC nad etherum as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainID) => {
  const provider = window.ethereum;
  const networkDetail = await fetchNetworkDetail(chainID); // network detail from dataUrl.ts file

  if (networkDetail !== undefined) {
    if (provider) {
      const chainId = parseInt(chainID, 10);
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
      } catch (switchError) {
        if (switchError?.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: networkDetail.chainName,
                  nativeCurrency: networkDetail.nativeCurrency,
                  rpcUrls: networkDetail.rpcUrls,
                  blockExplorerUrls: networkDetail.blockExplorerUrls,
                },
              ],
            });
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        }
        // handle other "switch" errors
      }
    } else {
      console.error(
        "Can't setup the BSC network on metamask because window.ethereum is undefined"
      );
      return false;
    }
  } else {
    console.log("Network undefined");
    return false;
  }
};

export const fetchNetworkDetail = (chainID) => {
    let selectedNetwork;
    Networks.map((item, index) => {
      if (item.chainId === chainID) {
        selectedNetwork = item;
      }
      return item;
    });
    return selectedNetwork;
};