import "./TokenScreen.css";
import TokenScreenContextProvider from "./TokenScreenContextProvider";
import ListTokens from "./widgets/ListTokens";
import MintTokenForm from "./widgets/MintTokenForm";

export default function TokenScreen() {

  return (
    <TokenScreenContextProvider>
      <div id="token-screen">
        <ListTokens />
        <MintTokenForm />
      </div>
    </TokenScreenContextProvider>
  )
}
