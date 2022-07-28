import { RefObject, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import SplToken from "../../../../domain/entities/SplToken";
import IEditableTokenForm from "../Dto/ITokenEditableForm";
import { TokenScreenContext } from "../TokenScreenContextProvider";

interface ITokenFormProps {
  textSubmitBtn: string;
  onSubmitBtn: (token: SplToken) => void;
  editableTokenState: IEditableTokenForm;
  isBlockchainFieldsDisabled: boolean
}

export default function TokenForm({
  editableTokenState: token,
  textSubmitBtn,
  onSubmitBtn,
  isBlockchainFieldsDisabled,
}: ITokenFormProps) {
  const { handleSetOpenMintTokenForm } = useContext(TokenScreenContext);

  return (
    <div id="token-form">
      <div className="back-button-div">
        <button className="btn-gray" onClick={() => handleSetOpenMintTokenForm(false)}>Back</button>
      </div>

      <form action="submit" onSubmit={e => {
        e.preventDefault();

        onSubmitBtn({
          name: token.getName(),
          supply: token.getSupply(),
          address: "", //token.getAddress(),
          mint_authority: token.getMintAuthority()!,
          freeze_authority: token.getFreezeAuthority(),
          is_swap_pool: false
        });
      }}>
        <div className="input-list">
          <InputTokenForm
            fieldRef={token.nameRef}
            placeholder="Name"
          />
          <InputTokenForm
            type="number"
            fieldRef={token.supplyRef}
            placeholder="Supply"
            disabled={isBlockchainFieldsDisabled}
          />
          <InputTokenForm
            fieldRef={token.mintAuthorityRef}
            placeholder="Mint Authority"
            disabled={isBlockchainFieldsDisabled}
          />
          <InputTokenForm
            fieldRef={token.freezeAuthorityRef}
            placeholder="Freeze Authority"
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

  function InputTokenForm(
    {
      type,
      fieldRef,
      placeholder,
      disabled
    }
      :
      {
        type?: string;
        fieldRef: RefObject<HTMLInputElement>;
        placeholder: string;
        disabled?: boolean
      }
  ) {
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
      // TODO: Understand and fix why this only works with timeout
      const timeout = setTimeout(() => {
        if (fieldRef.current && fieldRef.current.value.length > 0) {
          if (showLabel === false)
            setShowLabel(true);
        } else if (showLabel) {
          setShowLabel(false);
        }
      }, 1);

      return () => {
        clearTimeout(timeout);
      }
    }, []);


    return (
      <div className="text-left">
        <small style={{ color: "#888", visibility: showLabel ? "visible" : "hidden" }}>
          {placeholder}
        </small>

        <input
          ref={fieldRef}
          type={type ?? "text"}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              if (showLabel === false)
                setShowLabel(true);
            } else if (showLabel) {
              setShowLabel(false);
            }
          }}
        />
      </div>
    );
  }
}


