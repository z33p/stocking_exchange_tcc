import { useState, useEffect, useContext } from "react";
import { MainScreenContext } from "../MainScreen/MainScreenContextProvider";
import ITokenDto from "./Dto/ITokenDto";
import "./TokenScreen.css";
import TokenScreenContextProvider from "./TokenScreenContextProvider";
import ListTokens from "./widgets/ListTokens";
import MintTokenForm from "./widgets/MintTokenForm";

const { TokenBusiness } = window.Domain;

export default function TokenScreen() {
  const [openMintTokenForm, setOpenMintTokenForm] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);

  function handleSetOpenMintTokenForm(newState: boolean) {
    if (newState === openMintTokenForm)
      return;

    setSelectedTokenIndex(null);
    setOpenMintTokenForm(newState);
  }

  function handleSetSelectedTokenIndex(newSelectedTokenIndex: number | null) {
    if (selectedTokenIndex === newSelectedTokenIndex)
      return;

    setOpenMintTokenForm(true);
    setSelectedTokenIndex(newSelectedTokenIndex);
  };

  const [tokenArray, setTokenArray] = useState<ITokenDto[]>([]);

  const { setLoading } = useContext(MainScreenContext);

  useEffect(() => {
    setLoading(true);
    try {
      const tokens = TokenBusiness.getAllWithLimit({ limit: 10 });
      setTokenArray(tokens);
    } catch (error) {
      console.error(error);
      alert("Error");
    } finally {
      setLoading(false);
    }
  }, [])

  const initialContext: ITokenScreenContext = {
    openMintTokenForm,
    handleSetOpenMintTokenForm,
    tokenArray,
    setTokenArray,
    selectedTokenIndex,
    handleSetSelectedTokenIndex
  };

  return (
    <TokenScreenContextProvider initialContext={initialContext}>
      <div id="token-screen">
        {
          openMintTokenForm
            ? <MintTokenForm />
            : <ListTokens />
        }
      </div>
    </TokenScreenContextProvider>
  )
}

export interface ITokenScreenContext {
  openMintTokenForm: boolean;
  handleSetOpenMintTokenForm: (newState: boolean) => void;

  tokenArray: ITokenDto[];
  setTokenArray: React.Dispatch<React.SetStateAction<ITokenDto[]>>;

  selectedTokenIndex: number | null;
  handleSetSelectedTokenIndex: (newSelectedTokenIndex: number | null) => void;
}
