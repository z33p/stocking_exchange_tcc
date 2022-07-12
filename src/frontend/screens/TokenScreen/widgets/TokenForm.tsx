import IEditableTokenForm from "../Dto/ITokenEditableForm";

interface ITokenFormProps {
  textSubmitBtn: string;
  onSubmitBtn: () => void;
  editableTokenState: IEditableTokenForm;
}

export default function TokenForm({ editableTokenState: token, textSubmitBtn, onSubmitBtn }: ITokenFormProps) {
  return (
    <div id="token-form">
      <form action="">
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
          />
          <input type="text" placeholder="Mint Authority" />
          <input type="text" placeholder="Freeze Authority" />
          <input
            type="text"
            placeholder="Description"
            value={token.description}
            onChange={e => token.setDescription(e.target.value)}
          />
        </div>

        <div id="token-form-submit-token">
          <button className="btn-primary" onSubmit={onSubmitBtn}>
            {textSubmitBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
