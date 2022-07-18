import { createContext, useEffect, useState } from "react";
import ITokenDto from "./Dto/ITokenDto";

const { TokenBusiness } = window.Domain;

interface ITokenScreenContextProvider {
  children: JSX.Element;
}

export default function TokenScreenContextProvider({ children }: ITokenScreenContextProvider) {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);
  const [tokenArray, setTokenArray] = useState<ITokenDto[]>([]);

  useEffect(() => {
    const tokens = TokenBusiness.getAllWithLimit({ limit: 10 });
    setTokenArray(tokens);

    // setSelectedTokenIndex(0);
  }, [])

  const initialContext: ITokenScreenContext = {
    tokenArray,
    setTokenArray,
    selectedTokenIndex,
    setSelectedTokenIndex
  }

  return (
    <TokenScreenContext.Provider value={initialContext}>
      {children}
    </TokenScreenContext.Provider>
  );
}

export const TokenScreenContext = createContext<ITokenScreenContext>({} as ITokenScreenContext);

interface ITokenScreenContext {
  tokenArray: ITokenDto[];
  setTokenArray: React.Dispatch<React.SetStateAction<ITokenDto[]>>;

  selectedTokenIndex: number | null;
  setSelectedTokenIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
