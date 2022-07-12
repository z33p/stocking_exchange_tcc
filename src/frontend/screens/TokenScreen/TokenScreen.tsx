import "./TokenScreen.css";
import TokenScreenContextProvider from "./TokenScreenContextProvider";
import ListTokens from "./widgets/ListTokens";
import MintToken from "./widgets/MintToken";

export default function TokenScreen() {

  return (
    <TokenScreenContextProvider>
      <div id="token-screen">
        <ListTokens />
        <MintToken />
      </div>
    </TokenScreenContextProvider>
  )
}
