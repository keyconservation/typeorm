import { expect } from "chai"
import "reflect-metadata"
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
} from "../../../../utils/test-utils"
import { DataSource } from "../../../../../src/data-source/DataSource"
import { ConnectionMetadataBuilder } from "../../../../../src/connection/ConnectionMetadataBuilder"
import { EntityMetadataValidator } from "../../../../../src/metadata-builder/EntityMetadataValidator"
import { User } from "./entity/User"
import { SkillRequestApplication } from "./entity/SkillRequestApplication"
import { DiscussionBoard } from "./entity/DiscussionBoard"
import { Message } from "./entity/Message"

describe("query builder > filter condition > circular filter condition cascade", () => {
    let dataSources: DataSource[]
    before(
        async () =>
            (dataSources = await createTestingConnections({
                entities: [
                    DiscussionBoard,
                    Message,
                    SkillRequestApplication,
                    User,
                ],
                schemaCreate: true,
                dropSchema: true,
            })),
    )
    beforeEach(() => reloadTestingDatabases(dataSources))
    after(() => closeTestingConnections(dataSources))

    it("should handle circular filter condition cascades with additional non-circular cascading paths", () =>
        Promise.all(
            dataSources.map(async (dataSource) => {
                // Create test data
                const entityManager = dataSource.createEntityManager()

                const user = await entityManager.save(
                    entityManager.create(User, {
                        isDeactivated: false,
                    }),
                )

                const discussionBoard = await entityManager.save(
                    entityManager.create(DiscussionBoard, {}),
                )

                const skillRequestApplication = await entityManager.save(
                    entityManager.create(SkillRequestApplication, {
                        user: {
                            id: user.id,
                        },
                        discussionBoard,
                    }),
                )

                await entityManager.findOneOrFail(SkillRequestApplication, {
                    where: {
                        id: skillRequestApplication.id,
                    },
                    relations: {
                        discussionBoard: {
                            messages: true,
                        },
                    },
                })

                // deactivate the user
                await entityManager.update(
                    User,
                    { id: user.id },
                    { isDeactivated: true },
                )

                // expect not to find the skill request application
                const skillRequestApplication2 = await entityManager.findOne(
                    SkillRequestApplication,
                    {
                        where: {
                            id: skillRequestApplication.id,
                        },
                        relations: {
                            discussionBoard: {
                                messages: true,
                            },
                        },
                    },
                )
                expect(skillRequestApplication2).to.be.null
            }),
        ))

    it("should throw error if filterConditionsCascade is set on relations other than many-to-one and one-to-one", async () => {
        const connection = new DataSource({
            // dummy connection options, connection won't be established anyway
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [__dirname + "/entity/*{.js,.ts}"],
        })
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(
            connection,
        )
        const entityMetadatas =
            await connectionMetadataBuilder.buildEntityMetadatas([
                __dirname + "/entity/*{.js,.ts}",
            ])
        const entityMetadataValidator = new EntityMetadataValidator()
        expect(() =>
            entityMetadataValidator.validateMany(
                entityMetadatas,
                connection.driver,
            ),
        ).to.throw(Error)
    })
})
