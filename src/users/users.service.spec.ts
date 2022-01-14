import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  let jwtServie: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    jwtServie = module.get<JwtService>(JwtService);
  });

  it('should be define', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'fake@email.com',
      password: 'fakePassword',
      role: UserRole.Host,
    };
    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'fake@email.com',
      });

      const result = await service.createAccount(createAccountArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'Email is already taken',
      });
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockResolvedValue(createAccountArgs);

      const result = await service.createAccount(createAccountArgs);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: 'Could not create account' });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'fake@email.com',
      password: 'fakePassword',
    };
    it('should fail if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'Email is not exist',
      });
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);

      expect(jwtServie.sign).toHaveBeenCalledTimes(1);
      expect(jwtServie.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'signed-token' });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Could not login' });
    });
  });

  describe('findById', () => {
    const findByIdArgs = { id: 1 };
    it('should fail if no user is found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.findById(null);
      expect(result).toEqual({ ok: false, error: "Can't find user" });
    });
    it('should find an existing user', async () => {
      userRepository.findOne.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'Could not find User by Id' });
    });
  });

  describe('editProfile', () => {
    const existUser = { email: 'fake@oldUser.com' };
    const editUser = { id: 2, input: { email: 'edit@want.com' } };

    it('should user not exist', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.editProfile(1, existUser);
      expect(result).toEqual({ ok: false, error: 'User not found' });
    });

    it('should change email', async () => {
      userRepository.findOne.mockResolvedValue(existUser);
      const result = await service.editProfile(editUser.id, editUser.input);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('should change password', async () => {
      const editProfileArgs = {
        id: 1,
        input: { password: 'newPassword' },
      };
      userRepository.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(
        editProfileArgs.id,
        editProfileArgs.input,
      );
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, existUser);
      expect(result).toEqual({ ok: false, error: 'Could not edit profile' });
    });
  });
});
