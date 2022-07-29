import { createContext } from "react";

interface IMainScreenContextProvider {
  children?: JSX.Element;
  initialContext: IMainScreenContext;
}

export default function MainScreenContextProvider({ children, initialContext }: IMainScreenContextProvider) {
  return (
    <MainScreenContext.Provider value={initialContext}>
      {children}
    </MainScreenContext.Provider>
  );
}

export const MainScreenContext = createContext<IMainScreenContext>({} as IMainScreenContext);

export interface IMainScreenContext {
  selectedScreen: MyAppScreens | null;
  handleSetSelectedScreen: (newSelectedScreen: MyAppScreens | null) => void;

  loading: boolean,
  setLoading: (isLoading: boolean) => void
}

export enum MyAppScreens {
  HOME,
  LIST_TOKENS,
  WALLET,
  TRADE,
}
