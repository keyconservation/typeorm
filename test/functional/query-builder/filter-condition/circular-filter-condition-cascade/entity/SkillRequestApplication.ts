import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "../../../../../../src"
import { DiscussionBoard } from "./DiscussionBoard"
import { User } from "./User"

@Entity()
export class SkillRequestApplication {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, {
        nullable: false,
        filterConditionCascade: true,
    })
    user: User

    @OneToOne(() => DiscussionBoard, {
        cascade: true,
        nullable: false,
    })
    @JoinColumn()
    discussionBoard: DiscussionBoard
}
