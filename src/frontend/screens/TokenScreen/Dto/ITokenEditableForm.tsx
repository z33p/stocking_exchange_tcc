import { Dispatch, RefObject, SetStateAction } from "react";

export default interface IEditableTokenForm {
    getName: () => string;
    nameRef: RefObject<HTMLInputElement>;
    getSupply: () => number;
    supplyRef: RefObject<HTMLInputElement>;
    getMintAuthority: () => string | null;
    mintAuthorityRef: RefObject<HTMLInputElement>;
    getFreezeAuthority: () => string | null;
    freezeAuthorityRef: RefObject<HTMLInputElement>;
}
