import { getConnection } from 'typeorm'

async function clearDatabase() {
  const connection = getConnection()
  const entities = connection.entityMetadatas
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.query(`TRUNCATE TABLE "${entity.tableName}"`)
  }
  await connection.close()
}

global.afterEach(async () => {
  await clearDatabase()
})
