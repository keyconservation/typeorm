import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "../../../../../../src"
import { TeamMember } from "./TeamMember"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        rawFilterCondition(alias) {
            return `${alias} != true`
        },
    })
    isDeactivated: boolean

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToMany(() => User)
    @JoinTable()
    friends: User[]

    @OneToMany(() => TeamMember, (member) => member.user)
    teamMemberships: TeamMember[]
}
