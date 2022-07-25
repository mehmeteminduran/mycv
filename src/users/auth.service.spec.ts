import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('test@test.com', 'test');
        expect(user.password).not.toEqual('test');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => { 
        await service.signup('a@a.com', '1');
        try {
            await service.signup('a@a.com', '1');
        } catch (error) {
            expect(error.message).toBe('email in use');
        }

    });

    it('throws if sigin is called with an unused email', async () => {
        try {
            await service.signin('test2@test2.com', 'test2');
        } catch (error) {
            expect(error.message).toBe('user not found');
        }
    });

    it('throws if an invalid password is provided', async () => { 
        await service.signup('defwesfa@aasd.com', '1wefad');
        try {
            await service.signin('defwesfa@aasd.com', 'password');
        } catch (error) {
            expect(error.message).toBe('bad password');
        }
    });

    it('returns a user if correct password is provided', async () => { 
        await service.signup('asdf@asdf.com', 'mypassword')
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();

    });

})
