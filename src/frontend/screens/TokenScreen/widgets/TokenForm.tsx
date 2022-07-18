import IEditableTokenForm from "../Dto/ITokenEditableForm";

interface ITokenFormProps {
  textSubmitBtn: string;
  onSubmitBtn: (token: Token) => void;
  editableTokenState: IEditableTokenForm;
  isBlockchainFieldsDisabled: boolean
}

export default function TokenForm({ editableTokenState: token, textSubmitBtn, onSubmitBtn, isBlockchainFieldsDisabled }: ITokenFormProps) {
  return (
    <div id="token-form">
      <form action="" onSubmit={e => {
        e.preventDefault();
        onSubmitBtn({
          name: token.name,
          supply: token.supply,
          address: null,
          mint_authority: null,
          freeze_authority: null,
        });
      }}>
        <div className="input-list">
          <input
            type="text"
            placeholder="Name"
            value={token.name}
            onChange={e => token.setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Supply"
            value={token.supply}
            onChange={e => token.setSupply(e.target.valueAsNumber)}
            disabled={isBlockchainFieldsDisabled}
          />
          <input
            type="text"
            placeholder="Mint Authority"
            value={token.mintAuthority ?? ""}
            onChange={e => token.setMintAuthority(e.target.value)}
            disabled={isBlockchainFieldsDisabled}
          />
          <input
            type="text"
            placeholder="Freeze Authority"
            value={token.freezeAuthority ?? ""}
            onChange={e => token.setFreezeAuthority(e.target.value)}
            disabled={isBlockchainFieldsDisabled}
          />
        </div>

        <div id="token-form-submit-token">
          <button type="submit" className="btn-primary">
            {textSubmitBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
