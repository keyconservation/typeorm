import {
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "../../../../../../src"
import { Message } from "./Message"

@Entity()
export class DiscussionBoard {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Message, (message) => message.discussionBoard)
    messages: Message[]
}
