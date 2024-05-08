import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm"

import User from "./user.entity"

@Entity()
class Expense extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(_ => User)
  user: User

  @Column("text")
  description: string

  @Column()
  value: number

  @Column("date")
  date: Date

  @CreateDateColumn()
  cretedAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export default Expense
