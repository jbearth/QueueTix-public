import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
	implements ValidatorConstraintInterface {
	validate(email: string): Promise<boolean> {
		return prisma.user.findFirst({ where: { email } }).then((user: any) => {
			if (user) return false;
			return true;
		});
	}
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
	return function (object: unknown, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsEmailAlreadyExistConstraint,
		});
	};
}
