import { useContext, useEffect, useState } from "react";
import IAccountDto from "../../../domain/business/Dto/IAccountDto";
import { MainScreenContext } from "../MainScreen/MainScreenContextProvider";
import "./WalletScreen.css";

const { AccountBusiness } = window.Domain;

const colSpan = {
  name: 1,
  balance: 2,
  address: 5,
  send: 1,
  receive: 1
}

export default function WalletScreen() {
  const [accountsArray, setAccountsArray] = useState<IAccountDto[]>([]);

  const { setLoading } = useContext(MainScreenContext);

  useEffect(() => {
    setLoading(true);

    AccountBusiness
      .getAllWithLimit({ limit: 10 })
      .then((accounts) => setAccountsArray(accounts))
      .catch((error) => {
        console.error(error);
        alert("Error");
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div id="wallet-screen">
      <h1 className="page-title">Wallet</h1>
      <section>
        <table>
          <thead>
            <tr>
              <td colSpan={colSpan.name}>Name</td>
              <td colSpan={colSpan.balance}>Balance</td>
              <td colSpan={colSpan.address}>Address</td>
              <td colSpan={colSpan.send}>Send</td>
              <td colSpan={colSpan.receive}>Receive</td>
            </tr>
          </thead>

          <tbody>
            {
              accountsArray.map(account => (
                <tr key={account.address}>
                  <td colSpan={colSpan.name}>{account.tokenName}</td>
                  <td colSpan={colSpan.balance}>{account.balance.toLocaleString()}</td>
                  <td colSpan={colSpan.address}>{account.address}</td>
                  <td colSpan={colSpan.send}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d="M48.66 79.13C128.4 100.9 208.2 80.59 288 60.25C375 38.08 462 15.9 549 48.38C565.9 54.69 576 71.62 576 89.66V399.5C576 423.4 550.4 439.2 527.3 432.9C447.6 411.1 367.8 431.4 288 451.7C200.1 473.9 113.1 496.1 26.97 463.6C10.06 457.3 0 440.4 0 422.3V112.5C0 88.59 25.61 72.83 48.66 79.13L48.66 79.13zM287.1 352C332.2 352 368 309 368 255.1C368 202.1 332.2 159.1 287.1 159.1C243.8 159.1 207.1 202.1 207.1 255.1C207.1 309 243.8 352 287.1 352zM63.1 416H127.1C127.1 380.7 99.35 352 63.1 352V416zM63.1 143.1V207.1C99.35 207.1 127.1 179.3 127.1 143.1H63.1zM512 303.1C476.7 303.1 448 332.7 448 368H512V303.1zM448 95.1C448 131.3 476.7 159.1 512 159.1V95.1H448z" />
                    </svg>
                  </td>
                  <td colSpan={colSpan.receive}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d="M568.2 336.3c-13.12-17.81-38.14-21.66-55.93-8.469l-119.7 88.17h-120.6c-8.748 0-15.1-7.25-15.1-15.99c0-8.75 7.25-16 15.1-16h78.25c15.1 0 30.75-10.88 33.37-26.62c3.25-20-12.12-37.38-31.62-37.38H191.1c-26.1 0-53.12 9.25-74.12 26.25l-46.5 37.74L15.1 383.1C7.251 383.1 0 391.3 0 400v95.98C0 504.8 7.251 512 15.1 512h346.1c22.03 0 43.92-7.188 61.7-20.27l135.1-99.52C577.5 379.1 581.3 354.1 568.2 336.3zM279.3 175C271.7 173.9 261.7 170.3 252.9 167.1L248 165.4C235.5 160.1 221.8 167.5 217.4 179.1s2.121 26.2 14.59 30.64l4.655 1.656c8.486 3.061 17.88 6.095 27.39 8.312V232c0 13.25 10.73 24 23.98 24s24-10.75 24-24V221.6c25.27-5.723 42.88-21.85 46.1-45.72c8.688-50.05-38.89-63.66-64.42-70.95L288.4 103.1C262.1 95.64 263.6 92.42 264.3 88.31c1.156-6.766 15.3-10.06 32.21-7.391c4.938 .7813 11.37 2.547 19.65 5.422c12.53 4.281 26.21-2.312 30.52-14.84s-2.309-26.19-14.84-30.53c-7.602-2.627-13.92-4.358-19.82-5.721V24c0-13.25-10.75-24-24-24s-23.98 10.75-23.98 24v10.52C238.8 40.23 221.1 56.25 216.1 80.13C208.4 129.6 256.7 143.8 274.9 149.2l6.498 1.875c31.66 9.062 31.15 11.89 30.34 16.64C310.6 174.5 296.5 177.8 279.3 175z" />
                    </svg>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </section>
    </div>
  );
}