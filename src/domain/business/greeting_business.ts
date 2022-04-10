import * as greeting_service from "../../backend/services/greeting_service";

export function greeting() {
    greeting_service.greeting();
}