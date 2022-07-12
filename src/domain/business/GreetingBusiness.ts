import GreetingService from "../../backend/services/Greeting/GreetingService";

async function greeting() {
    await GreetingService.greeting();
}

const GreetingBusiness = {
    greeting
}


export default GreetingBusiness;