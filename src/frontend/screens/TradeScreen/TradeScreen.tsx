import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import IAccountDto from "../../../domain/business/Dto/IAccountDto";
import SplToken from "../../../domain/entities/SplToken";
import SwapTokenAmm from "../../../domain/entities/SwapTokenAmm";
import TokenTypeEnum from "../../../domain/enums/TokenTypeEnum";
import { MainScreenContext } from "../MainScreen/MainScreenContextProvider";
import "./TradeScreen.css";

const { TokenBusiness, AccountBusiness, AmmBusiness } = window.Domain;

function TradeScreen() {
  const { setLoading } = useContext(MainScreenContext);
  const [tokenArray, setTokenArray] = useState<SplToken[]>([]);

  useEffect(() => {
    const tokens = TokenBusiness.getAllWithLimit({ limit: 20 });
    setTokenArray(tokens);
  }, []);

  const [selectedTokenA, setSelectedTokenA] = useState<SplToken | null>(null);
  const [userAccountTokenA, setUserAccountTokenA] = useState<IAccountDto | null>(null);
  const [userAccountTokenB, setUserAccountTokenB] = useState<IAccountDto | null>(null);

  const [accountPoolA, setAccountPoolA] = useState<IAccountDto | null>();
  const [accountPoolB, setAccountPoolB] = useState<IAccountDto | null>();

  async function handleSetSelectedToken(newSelected: SplToken | null) {
    if (newSelected === selectedTokenA)
      return;

    setLoading(true);

    try {
      if (newSelected) {
        const userAccountTokenAPromise = AccountBusiness.getTokenAccountFromOwner(newSelected.address);

        const swapTokenAmm = AmmBusiness.findByToken(newSelected);

        const isStablecoin = newSelected.token_type === TokenTypeEnum.STABLECOIN;
        const getPoolAccountsPromise = getPoolTokenAccounts(swapTokenAmm, isStablecoin);

        const siblingAmmToken = isStablecoin
          ? swapTokenAmm.token_a_pk
          : swapTokenAmm.token_b_pk;

        const userAccountTokenBPromise = AccountBusiness.getTokenAccountFromOwner(
          siblingAmmToken
        );

        const [accountTokenA, accountTokenB] = await Promise.all([userAccountTokenAPromise, userAccountTokenBPromise])
        accountTokenA.tokenName = newSelected.name;
        accountTokenB.tokenName = tokenArray.find(t => t.address === siblingAmmToken)?.name ?? accountTokenB.tokenName;

        setUserAccountTokenA(accountTokenA);
        setUserAccountTokenB(accountTokenB);

        setSwapAmount(BigInt(0));
        setPriceRatio(0);
        setReceivedAmount(0);

        await getPoolAccountsPromise;
      }

      setSelectedTokenA(newSelected);
    } catch (error) {
      console.error(error);
      alert("Error")
    } finally {
      setLoading(false);
    }

    async function getPoolTokenAccounts(swapTokenAmm: SwapTokenAmm, isStablecoin: boolean) {
      const accountAPromise = AccountBusiness.getTokenAccount(
        swapTokenAmm.token_a_pk, swapTokenAmm.token_a_account_pk
      );
      const accountBPromise = AccountBusiness.getTokenAccount(
        swapTokenAmm.token_b_pk, swapTokenAmm.token_b_account_pk
      );

      if (isStablecoin) {
        setAccountPoolA(await accountBPromise);
        setAccountPoolB(await accountAPromise);
      } else {
        setAccountPoolA(await accountAPromise);
        setAccountPoolB(await accountBPromise);
      }
    }
  };

  const [swapAmount, setSwapAmount] = useState<bigint>(BigInt(0));
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [priceRatio, setPriceRatio] = useState<number>(0);

  useEffect(() => { calculatePrice(swapAmount) }, [swapAmount])

  function handleSetSwapAmount(e: ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);

    if (value >= 0 && selectedTokenA)
      setSwapAmount(BigInt(value));
    else
      setSwapAmount(BigInt(0));
  }

  return (
    <div id="trade-screen">
      <section>
        <div className="trade-div">
          <h1 className="page-title">Trade</h1>

          <div>
            <label htmlFor="from">
              {selectedTokenA ? "From: " + selectedTokenA.name.split(" - ")[0] : "From"}
            </label>
            <input
              name="from"
              type="number"
              value={Number(swapAmount)}
              onChange={handleSetSwapAmount}
            />
            <div className="aux-button">
              <button className="btn-primary" disabled={!selectedTokenA} onClick={setFromToMaxValue}>Max</button>
              <div className="dropdown">
                <p>
                  <span style={{ paddingRight: .2 + "em" }}>Assets</span>
                  <svg style={{ paddingBottom: .2 + "em" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width={1 + "em"}>
                    <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                  </svg>
                </p>
                <div className="dropdown-content">
                  <ul>
                    {
                      tokenArray.map((token, index) => (
                        <li key={token.address} onClick={async () => await handleSetSelectedToken(tokenArray[index])}>
                          {token.name}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <span>Price: {priceRatio}</span>
            </div>
          </div>

          <div>
            <label htmlFor="to">
              To {userAccountTokenB ? ": " + userAccountTokenB.tokenName.split(" - ")[0] : ""}
            </label>
            <input name="to" type="number" disabled value={receivedAmount.toFixed(2)} />
          </div>

          <div className="confirm-btn-div">
            <button className="btn-primary" onClick={confirmBtn} >Confirm</button>
          </div>
        </div>
      </section>
    </div>
  );

  function calculatePrice(swapAmount: bigint) {
    if (accountPoolA && accountPoolB && swapAmount > 0) {
      const product = accountPoolA.balance * accountPoolB.balance;

      const newAmountPoolB = accountPoolB.balance + swapAmount;
      const amountPoolA = Number(accountPoolA.balance);

      const newAmountPoolA = Number(product) / Number(newAmountPoolB);
      const received = amountPoolA-newAmountPoolA;

      setReceivedAmount(received);
      setPriceRatio(received/Number(swapAmount));
    }
  }

  async function setFromToMaxValue() {
    if (!selectedTokenA) {
      alert("Selecione um token")
      return;
    }

    const account = await AccountBusiness.getTokenAccountFromOwner(selectedTokenA.address);
    setSwapAmount(account!.balance);
  }

  async function confirmBtn() {
    if (selectedTokenA && swapAmount > 0) {
      setLoading(true);

      try {
        await AmmBusiness.swap(selectedTokenA, swapAmount);
        alert("Sucesso")
      } catch (error) {
        console.error(error);
        alert("Error");
      } finally {
        setLoading(false);
      }

    } else {
      alert("Selecione um token ou insira uma quantidade");
    }
  }
}

export default TradeScreen;