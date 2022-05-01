// main.ts
import { singleton } from "tsyringe";
import GreetingService from "../../backend/services/Greeting/GreetingService";

@singleton()
class GreetingBusiness {
    constructor(private _greetingService: GreetingService) {}

    async greeting() {
        await this._greetingService.greeting();
    }
}

export default GreetingBusiness;