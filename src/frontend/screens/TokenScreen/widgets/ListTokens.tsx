import { useContext } from "react";
import { TokenScreenContext as TokenScreenContext } from "../TokenScreenContextProvider";

export default function ListTokens() {
  const { openMintTokenForm, handleSetOpenMintTokenForm } = useContext(TokenScreenContext);

  function OnClickOpenPageMintToken() {
    handleSetOpenMintTokenForm(true);
  }

  return (
    <div id="list-token-screen">
      <h1 className="page-title">List Token</h1>
      <div id="page-mint-token-btn">
        <button
          className="btn-primary"
          onClick={() => OnClickOpenPageMintToken()}
          disabled={openMintTokenForm}
        >
          + Mint Token
        </button>
      </div>
      <CardListTokens />
    </div>
  )
}

const CardListTokens = () => {
  const { tokenArray, handleSetSelectedTokenIndex } = useContext(TokenScreenContext);

  function OnClickTableRow(index: number) {
    handleSetSelectedTokenIndex(index);
  }

  return (
    <div id="card-list-tokens">
      <table>
        <TableHead />
        <tbody>
          {tokenArray.map((token, index) => (
            <tr key={index} onClick={() => OnClickTableRow(index)}>
              <td>{token.name}</td>
              <td>{token.supply.toLocaleString()}</td>
              <td>{token.address}</td>
              <td>{token.mint_authority}</td>
              <td>{token.freeze_authority ? token.freeze_authority : " - "}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const TableHead = () => (
  <thead>
    <tr>
      <td>Name</td>
      <td>Amount</td>
      <td>Address</td>
      <td>Mint Authority</td>
      <td>Freeze Authority</td>
    </tr>
  </thead>
)