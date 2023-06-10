import './App.css';
import RenderLogo from './RenderLogo';
import MainSection from './MainSection';
import Footer from './Footer'
import Header from './images/header.png'
import RenderHeader from './RenderHeader';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from './utils/web3React'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NetworkContextName = 'NETWORK'
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
        />
        <div className="App">
          <RenderHeader Header={Header} />
          <MainSection />
          <Footer />
        </div>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

export default App;