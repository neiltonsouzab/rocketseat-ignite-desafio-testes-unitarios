import exp from "node:constants"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe('GetBalanceUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it('should be able to get balance of the user', async () => {
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

    const otherStatement = await inMemoryStatementsRepository.create({
      description: 'other-statement-description',
      type: OperationType.DEPOSIT,
      amount: 200,
      user_id: user.id || ''
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id || ''
    })

    expect(balance.balance).toBe(300)
    expect(balance.statement).toEqual([statement, otherStatement])
  })

  it('should not be able to get balance of non-exists user', async () => {
    await expect(getBalanceUseCase.execute({
      user_id: 'non-exists'
    })).rejects.toBeInstanceOf(GetBalanceError)
  })
})
