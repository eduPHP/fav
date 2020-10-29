import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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
}
