import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe('ShowUserProfileUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to show a user profile', async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    const user = await showUserProfileUseCase.execute(id || '')

    expect(user.name).toBe('user-name')
    expect(user.email).toBe('user-email')

  })

  it('should not be able to show profile for non-exists user', async () => {
    await expect(showUserProfileUseCase.execute('non-exists')).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
