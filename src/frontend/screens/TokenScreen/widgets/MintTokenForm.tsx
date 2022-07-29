import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { MainScreenContext } from "../../MainScreen/MainScreenContextProvider";
import ITokenDto from "../Dto/ITokenDto";
import IEditableTokenForm from "../Dto/ITokenEditableForm";
import { TokenScreenContext } from "../TokenScreenContextProvider";
import TokenForm from "./TokenForm";

const { TokenBusiness } = window.Domain;

export default function MintTokenForm() {
  const { setLoading } = useContext(MainScreenContext);

  const {
    tokenArray,
    selectedTokenIndex,
    handleSetSelectedTokenIndex,
    setTokenArray,
  } = useContext(TokenScreenContext);

  let tokenForm;
  if (selectedTokenIndex === null)
    tokenForm = mintTokenForm();
  else
    tokenForm = editTokenForm(selectedTokenIndex, tokenArray);

  return (
    <div id="mint-token-screen">
      <h1 className="page-title">Mint Token</h1>
      <div id="mint-token-screen-body">
        {tokenForm}
      </div>
    </div>
  )

  function mintTokenForm() {
    let token: ITokenDto = {
      name: "WBTC",
      supply: BigInt(500_000),
      address: "",
      mint_authority: "",
      freeze_authority: "",
    };

    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      textSubmitBtn="Mint"
      onSubmitBtn={async (token) => {
        setLoading(true);

        setTokenArray([...tokenArray, token]);
        handleSetSelectedTokenIndex(tokenArray.length);

        try {
          await TokenBusiness.mintToken(token);

          // TODO: use set state here instead of outside try catch
          // setTokenArray([...tokenArray, token]);
          // handleSetSelectedTokenIndex(tokenArray.length);

          alert("Sucesso");
        } catch (error) {
          console.error(error);
          alert("Error")
        } finally {
          setLoading(false);
        }
      }}
      editableTokenState={editableTokenForm}
      isBlockchainFieldsDisabled={false}
    />
  }

  function editTokenForm(selectedTokenIndex: number, tokenArray: ITokenDto[]) {
    let token: ITokenDto = tokenArray[selectedTokenIndex];
    const editableTokenForm: IEditableTokenForm = editableTokenState(token);

    return <TokenForm
      textSubmitBtn="Save"
      onSubmitBtn={(token) => {
        console.log(token);
      }}
      editableTokenState={editableTokenForm}
      isBlockchainFieldsDisabled
    />;
  }

  function editableTokenState(token: ITokenDto) {
    const nameRef = useRef<HTMLInputElement>(null);
    const supplyRef = useRef<HTMLInputElement>(null);
    const mintAuthorityRef = useRef<HTMLInputElement>(null);
    const freezeAuthorityRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      nameRef.current!.value = token.name;
      supplyRef.current!.value = token.supply.toString();
      mintAuthorityRef.current!.value = token.mint_authority ?? "";
      freezeAuthorityRef.current!.value = token.freeze_authority ?? "";

    }, [selectedTokenIndex]);

    const editableTokenForm: IEditableTokenForm = {
      getName: () => nameRef.current!.value,
      nameRef,
      getSupply: () => supplyRef.current!.valueAsNumber,
      supplyRef,
      getMintAuthority: () => mintAuthorityRef.current!.value,
      mintAuthorityRef,
      getFreezeAuthority: () => freezeAuthorityRef.current!.value,
      freezeAuthorityRef,
    };

    return editableTokenForm;
  }
}
