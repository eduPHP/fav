import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm'

import User from "./User";

@Entity('password_resets')
export default class PasswordReset {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    token: string;

    @Column({default: null})
    used_at?: Date

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User
}
