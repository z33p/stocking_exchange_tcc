import { Dispatch, SetStateAction } from "react";

export default interface IEditableTokenForm {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    supply: number;
    setSupply: Dispatch<SetStateAction<number>>;
    mintAuthority: string | null;
    setMintAuthority: Dispatch<SetStateAction<string | null>>;
    freezeAuthority: string | null;
    setFreezeAuthority: Dispatch<SetStateAction<string | null>>;
}
