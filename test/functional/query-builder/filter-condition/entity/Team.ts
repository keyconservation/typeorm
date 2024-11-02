import {
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "../../../../../src"
import { User } from "./User"

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, {
        eager: true,
        filterConditionCascade: true,
    })
    @JoinColumn()
    user: User
}
