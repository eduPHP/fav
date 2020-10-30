import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'
import User from "./User";

@Entity('feeds')
export default class Feed {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    name: string;
    @Column()
    url: string;
    @Column()
    active: boolean;
    @Column()
    user_id: number;

    @ManyToOne(() => User, user => user.feeds)
    @JoinColumn({name: 'user_id'})
    user: User
}
