import { useEffect } from "react";
import { useContext, useState } from "react";
import ITokenDto from "../Dto/ITokenDto";
import IEditableTokenForm from "../Dto/ITokenEditableForm";
import { TokenScreenContext } from "../TokenScreenContextProvider";
import TokenForm from "./TokenForm";

const { TokenBusiness } = window.Domain;

export default function MintTokenForm() {
  const {
    tokenArray,
    selectedTokenIndex,
    setSelectedTokenIndex,
    setTokenArray
  } = useContext(TokenScreenContext);

  let tokenForm;
  if (selectedTokenIndex === null)
    tokenForm = mintTokenForm();
  else
    tokenForm = editTokenForm(selectedTokenIndex, tokenArray);

  return (
    <div id="mint-token-screen">
      <h1>Mint Token</h1>
      {tokenForm}
    </div>
  )

  function mintTokenForm() {
    let token: ITokenDto = {
      name: "Mint token",
      supply: 10000,
      address: "",
      mint_authority: "",
      freeze_authority: "",
    };

    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      editableTokenState={editableTokenForm}
      textSubmitBtn="Mint"
      onSubmitBtn={(token) => {
        console.log(token);
        TokenBusiness.mintToken(token);
        setTokenArray([...tokenArray, token]);
        setSelectedTokenIndex(tokenArray.length)
      }}
      isBlockchainFieldsDisabled={false}
    />
  }

  function editTokenForm(selectedTokenIndex: number, tokenArray: ITokenDto[]) {
    let token: ITokenDto = tokenArray[selectedTokenIndex];
    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      editableTokenState={editableTokenForm}
      textSubmitBtn="Save"
      onSubmitBtn={(token) => {
        console.log(token);
      }}
      isBlockchainFieldsDisabled
    />;
  }

  function editableTokenState(token: ITokenDto) {
    const [name, setName] = useState(token.name);
    const [supply, setSupply] = useState(token.supply);
    const [mintAuthority, setMintAuthority] = useState(token.mint_authority);
    const [freezeAuthority, setFreezeAuthority] = useState(token.freeze_authority);

    useEffect(() => {
      setName(token.name);
      setSupply(token.supply);
      setMintAuthority(token.mint_authority);
      setFreezeAuthority(token.freeze_authority);
    }, [selectedTokenIndex]);

    const editableTokenForm: IEditableTokenForm = {
      name,
      setName,
      supply,
      setSupply,
      mintAuthority,
      setMintAuthority,
      freezeAuthority,
      setFreezeAuthority
    };

    return editableTokenForm;
  }
}
