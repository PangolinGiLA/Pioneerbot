import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class MusicLog {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ytid: string

    @Column()
    requestedBy: string

    @Column()
    guildId: string

    @Column()
    random: boolean

    @Column()
    playedAt: Date

    @Column({default: false})
    removed: boolean
    
}
