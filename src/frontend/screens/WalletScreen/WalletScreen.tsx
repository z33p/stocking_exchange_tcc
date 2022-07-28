import { useEffect, useState } from "react";
import IAccountDto from "../../../domain/business/Dto/IAccountDto";
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

  useEffect(() => {
    AccountBusiness
      .getAllWithLimit({ limit: 10 })
      .then((accounts) => setAccountsArray(accounts));
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
                <tr>
                  <td colSpan={colSpan.name}>{account.tokenName}</td>
                  <td colSpan={colSpan.balance}>{account.balance.toLocaleString()}</td>
                  <td colSpan={colSpan.address}>{account.address}</td>
                  <td colSpan={colSpan.send}></td>
                  <td colSpan={colSpan.receive}></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </section>
    </div>
  );
}