import { useContext } from "react";
import { MainScreenContext, MyAppScreens } from "../MainScreen/MainScreenContextProvider";
import "./VerticalNavBar.css";

export const VerticalNavBar = () => {
  const { handleSetSelectedScreen } = useContext(MainScreenContext);

  return (
    <div id="vertical-navbar">
      <ul>
        <li onClick={() => handleSetSelectedScreen(MyAppScreens.LIST_TOKENS)}>Tokens</li>
        <li onClick={() => handleSetSelectedScreen(MyAppScreens.WALLET)}>Wallet</li>
        <li onClick={() => handleSetSelectedScreen(MyAppScreens.TRADE)}>Trade</li>
      </ul>
    </div>
  );
};
