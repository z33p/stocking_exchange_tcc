import { Dispatch, SetStateAction } from "react";

export default interface IEditableTokenForm {
    name: string;
    setName: Dispatch<SetStateAction<string>>
    description: string;
    setDescription: Dispatch<SetStateAction<string>>
    supply: number;
    setSupply: Dispatch<SetStateAction<number>>
}
