import {faker} from '@faker-js/faker'
import { User } from '../models/user.js';

const createUser = async(numUser) => {
    try {
        const userPromise = [];

        for (let index = 0; index < numUser; index++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }

            })
            userPromise.push(tempUser);
                        
        }

        await Promise.all(userPromise);
        console.log("users created" , numUser);
        process.exit(1);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export {
    createUser
}