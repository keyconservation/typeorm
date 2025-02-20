import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "../../../../../../src"
import { DiscussionBoard } from "./DiscussionBoard"
import { User } from "./User"

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
        () => DiscussionBoard,
        (discussionBoard) => discussionBoard.messages,
    )
    discussionBoard: DiscussionBoard

    @ManyToOne(() => User, {
        eager: true,
        nullable: false,
    })
    user: User
}
