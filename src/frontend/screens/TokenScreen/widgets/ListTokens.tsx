import { useContext } from "react";
import { TokenScreenContext as TokenScreenContext } from "../TokenScreenContextProvider";

export default function ListTokens() {
  const { selectedTokenIndex, setSelectedTokenIndex, setTokenArray } = useContext(TokenScreenContext);

  function OnClickOpenPageMintToken() {
    setSelectedTokenIndex(null);
  }

  return (
    <div id="list-token-screen">
      <div className="">
        <h1>List Token</h1>
        <div id="page-mint-token-btn">
          <button
            className="btn-primary"
            onClick={() => OnClickOpenPageMintToken()}
            disabled={selectedTokenIndex === null}
          >
            + Mint Token
          </button>
        </div>
      </div>
      <CardListTokens />
    </div>
  )
}

const CardListTokens = () => {
  const { tokenArray, setSelectedTokenIndex } = useContext(TokenScreenContext);

  function OnClickTableRow(index: number) {
    setSelectedTokenIndex(index);
  }

  return (
    <div id="card-list-tokens">
      <table>
        <TableHead />
        <tbody>
          {tokenArray.map((token, index) => (
            <tr key={index} onClick={() => OnClickTableRow(index)}>
              <td>{token.name}</td>
              <td>{token.supply}</td>
              <td>Send</td>
              <td>Receive</td>
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
      <td></td>
      <td></td>
    </tr>
  </thead>
)