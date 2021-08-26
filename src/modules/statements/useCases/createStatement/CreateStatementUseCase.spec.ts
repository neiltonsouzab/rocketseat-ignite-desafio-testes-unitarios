import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe('CreateStatementUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to create a new statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    const statement = await createStatementUseCase.execute({
      description: 'statement-description',
      type: OperationType.DEPOSIT,
      amount: 100,
      user_id: user.id || '',
    })

    expect(statement).toHaveProperty('id')
  })

  it('should not be able to create a new statement of non-exists user', async () => {
    await expect(createStatementUseCase.execute({
      description: 'statement-description',
      type: OperationType.DEPOSIT,
      amount: 100,
      user_id: 'non-exists',
    })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to create a new statement of type withdraw if balance less than amount', async () => {
     const user = await inMemoryUsersRepository.create({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    await createStatementUseCase.execute({
      description: 'statement-description',
      type: OperationType.DEPOSIT,
      amount: 100,
      user_id: user.id || '',
    })

    await expect(createStatementUseCase.execute({
      description: 'statement-description',
      type: OperationType.WITHDRAW,
      amount: 200,
      user_id: user.id || '',
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
