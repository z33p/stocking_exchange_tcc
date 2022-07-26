import { createContext } from "react";
import ITokenDto from "./Dto/ITokenDto";
import { ITokenScreenContext } from "./TokenScreen";

interface ITokenScreenContextProvider {
  children: JSX.Element;
  initialContext: ITokenScreenContext;
}

export default function TokenScreenContextProvider({ children, initialContext }: ITokenScreenContextProvider) {
  return (
    <TokenScreenContext.Provider value={initialContext}>
      {children}
    </TokenScreenContext.Provider>
  );
}

export const TokenScreenContext = createContext<ITokenScreenContext>({} as ITokenScreenContext);
