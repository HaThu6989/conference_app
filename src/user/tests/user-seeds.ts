import { User } from "../../user/entities/user.entity";

// créer nos utilisateurs
export const testUsers = {
  alice : new User ({
      id:'alice',
      emailAddress: 'alice@gmail.com',
      password: 'qwerty'
    }),
  bob : new User ({
      id:'bob',
      emailAddress: 'bob@gmail.com',
      password: 'qwerty'
    }), 
  anna: new User({
    id: 'anna',
    emailAddress: 'anna@gmail.com',
    password: 'qwerty'
  })
}

