import { ChangeEvent, useEffect, useRef, useState } from "react";
import IAccountDto from "../../../domain/business/Dto/IAccountDto";
import SplToken from "../../../domain/entities/SplToken";
import "./TradeScreen.css";

const { TokenBusiness, AccountBusiness, AmmBusiness } = window.Domain;

function TradeScreen() {
  const [tokenArray, setTokenArray] = useState<SplToken[]>([]);

  useEffect(() => {
    const tokens = TokenBusiness.getAllWithLimit({ limit: 5 });
    setTokenArray(tokens);
  }, []);

  const [selectedTokenA, setSelectedTokenA] = useState<SplToken | null>(null);
  const [accountTokenA, setAccountTokenA] = useState<IAccountDto | null>(null);
  const [accountTokenB, setAccountTokenB] = useState<IAccountDto | null>(null);

  const toInputHtml = useRef<HTMLInputElement>(null);

  async function handleSetSelectedToken(newSelected: SplToken | null) {
    console.log(newSelected);
    console.log(selectedTokenA);

    if (newSelected === selectedTokenA)
      return;

    if (newSelected) {
      const accountPromise = AccountBusiness.getTokenAccountFromOwner(newSelected.address);

      const amm = AmmBusiness.findByTokenA(newSelected.address);

      const stablecoinAccountPromise = AccountBusiness.getTokenAccountFromOwner(amm.token_b_pk);

      const [accountTokenA, accountTokenB] = await Promise.all([accountPromise, stablecoinAccountPromise])

      setAccountTokenA(accountTokenA);
      setAccountTokenB(accountTokenB);

      setSwapAmount(BigInt(0));
      toInputHtml.current!.value = accountTokenB!.balance.toString();
    }

    setSelectedTokenA(newSelected);
  };

  const [swapAmount, setSwapAmount] = useState<bigint>(BigInt(0));
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
              {selectedTokenA ? "From: " + selectedTokenA.name : "From"}
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
                <span className="btn-gray">Tokens</span>
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
              To {accountTokenB ? ": " + "USDC" : ""}
            </label>
            <input ref={toInputHtml} name="to" type="number" disabled defaultValue={0} />
          </div>

          <div className="confirm-btn-div">
            <button className="btn-primary" onClick={confirmBtn} >Confirm</button>
          </div>
        </div>
      </section>
    </div>
  );

  function calculatePrice(swapAmount: bigint) {
    if (accountTokenA && accountTokenB && swapAmount > 0) {
      const balanceTokenAccountB = accountTokenB.balance + swapAmount;
      const balanceTokenAccountA = accountTokenA.balance;

      const newBalanceTokenAccountB = balanceTokenAccountB + swapAmount;

      const product = Number(balanceTokenAccountA * balanceTokenAccountB);

      const newAmountTokenA = Number(balanceTokenAccountA) - (product / Number(newBalanceTokenAccountB));
      const price = Number(swapAmount) / newAmountTokenA;

      setPriceRatio(price);
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

  function confirmBtn() {
    if (selectedTokenA) {
      AmmBusiness.swap(selectedTokenA.address, swapAmount);
    } else {
      alert("Selecione um token");
    }
  }
}

export default TradeScreen;