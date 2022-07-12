import { useEffect } from "react";
import { useContext, useState } from "react";
import ITokenDto from "../Dto/ITokenDto";
import IEditableTokenForm from "../Dto/ITokenEditableForm";
import { TokenScreenContext } from "../TokenScreenContextProvider";
import TokenForm from "./TokenForm";

export default function MintToken() {
  const { tokenArray, selectedTokenIndex } = useContext(TokenScreenContext);

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
      name: "",
      description: "",
      supply: 0
    };

    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      editableTokenState={editableTokenForm}
      textSubmitBtn="Mint"
      onSubmitBtn={() => { }}
    />
  }

  function editTokenForm(selectedTokenIndex: number, tokenArray: ITokenDto[]) {
    let token: ITokenDto = tokenArray[selectedTokenIndex];
    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      editableTokenState={editableTokenForm}
      textSubmitBtn="Save"
      onSubmitBtn={() => { }}
    />;
  }

  function editableTokenState(token: ITokenDto) {
    const [name, setName] = useState(token.name);
    const [description, setDescription] = useState(token.description);
    const [supply, setSupply] = useState(token.supply);

    useEffect(() => {
      setName(token.name);
      setDescription(token.description);
      setSupply(token.supply);
    }, [selectedTokenIndex]);

    const editableTokenForm: IEditableTokenForm = {
      name,
      setName,
      description,
      setDescription,
      supply,
      setSupply
    };

    return editableTokenForm;
  }
}
