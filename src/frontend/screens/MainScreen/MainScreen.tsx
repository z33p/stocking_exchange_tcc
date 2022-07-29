import "./MainScreen.css";
import { VerticalNavBar } from "../widgets/VerticalNavBar";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import TokenScreen from "../TokenScreen/TokenScreen";
import WalletScreen from "../WalletScreen/WalletScreen";
import MainScreenContextProvider, { IMainScreenContext, MyAppScreens } from "./MainScreenContextProvider";
import TradeScreen from "../TradeScreen/TradeScreen";
import { useState } from "react";

export default function MainScreen() {
  const [selectedScreen, setSelectedScreen] = useState<MyAppScreens | null>(MyAppScreens.LIST_TOKENS);
  const [loading, setLoading] = useState(false);

  function handleSetSelectedScreen(newSelectedScreen: MyAppScreens | null) {
    if (selectedScreen === newSelectedScreen)
      return;

    setSelectedScreen(newSelectedScreen);
  };

  const initialContext: IMainScreenContext = {
    selectedScreen,
    handleSetSelectedScreen,

    loading,
    setLoading
  }

  const screen = selectedScreen !== null ? screens[selectedScreen] : null;

  return (
    <MainScreenContextProvider initialContext={initialContext}>
      <>
        <LoadingScreen visible={loading} />
        <div id="main-screen">
          <VerticalNavBar />
          {screen}
        </div>
      </>
    </MainScreenContextProvider>
  )
}

const screens = [
  <TokenScreen />,
  <WalletScreen />,
  <TradeScreen />,
];