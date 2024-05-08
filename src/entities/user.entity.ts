import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  name: string

  @Column()
  email: string
  
  @CreateDateColumn()
  cretedAt: Date
  
  @UpdateDateColumn()
  updatedAt: Date
}

export default User
