import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import Feed from './Feed'

export interface UserView {
  id: number
  name: string
  email: string
}

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Feed, feed => feed.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  feeds: Feed[]
}
