import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorService {
    /**
     * Checks if the given value is equal to an Enum value
     * @param value
     * @param en
     */
    validateEnum(value, en) {

        return Object.values(en).includes(value.toUpperCase())
    }
}

