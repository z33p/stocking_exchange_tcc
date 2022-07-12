import "./MainScreen.css";
import { VerticalNavBar } from "./widgets/VerticalNavBar";
import TokenScreen from "./TokenScreen/TokenScreen";

export default function MainScreen() {
  return (
    <div id="main-screen">
      <VerticalNavBar />
      <TokenScreen />
    </div>
  )
}
