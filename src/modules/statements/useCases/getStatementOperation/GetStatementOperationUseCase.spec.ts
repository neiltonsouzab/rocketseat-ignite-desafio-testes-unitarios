import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('GetStatementOperation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to get statement operation of user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    const statement = await inMemoryStatementsRepository.create({
      description: 'statement-description',
      type: OperationType.DEPOSIT,
      amount: 100,
      user_id: user.id || ''
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id || '',
      user_id: user.id || ''
    })

    expect(statementOperation.description).toBe(statement.description)
    expect(statement.user_id).toBe(user.id)
  })

  it('should not be able to get statement operation of non-exists user', async () => {
    await expect(getStatementOperationUseCase.execute({
      statement_id: 'statement-id',
      user_id: 'non-exists'
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get statement operation of non-exists user or non-exists statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user-name',
      email: 'user-email',
      password: 'user-password'
    })

    await expect(getStatementOperationUseCase.execute({
      statement_id: 'non-exists',
      user_id: user.id || ''
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
