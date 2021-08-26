import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with email already exists', async () => {
    await createUserUseCase.execute({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    await expect(createUserUseCase.execute({
      name: 'other-user-name',
      email: 'user-email',
      password: 'other-user-password'
    })).rejects.toBeInstanceOf(CreateUserError)
  })
})
