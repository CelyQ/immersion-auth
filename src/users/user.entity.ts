import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id)
  }
}
