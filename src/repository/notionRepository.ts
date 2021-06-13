import {Client} from '@notionhq/client';
import {SelectProperty} from '@notionhq/client/build/src/api-types';
import {AssertionError} from 'assert';
import {Item} from '../data/item';
import {NotionMapper} from '../mapper/notionMapper';

export class NotionRepository {

    readonly notionClient = new Client(
        {
            auth: process.env.NOTION_TOKEN,
        }
    );

    async getItems(): Promise<Item[]> {
        const res = await this.notionClient.databases.query(
            {
                database_id: process.env.DATABASE_ID!
            }
        );

        const pages = res.results;
        return NotionMapper.toItems(pages);
    }

    async getPlaceList(): Promise<string[]> {
        const res = await this.notionClient.databases.retrieve(
            {
                database_id: process.env.DATABASE_ID!
            }
        );

        const propertyPlace = res.properties['場所'] as SelectProperty;
        const placeList = propertyPlace.select.options.map(value => value.name);
        if (placeList.length == 0) {
            throw AssertionError;
        }

        return placeList;
    }

    async createItem(name: string, place: string) {
        // noinspection NonAsciiCharacters
        await this.notionClient.pages.create(
            {
                parent: {
                    database_id: process.env.DATABASE_ID!
                },
                properties: {
                    '名前': {
                        type: 'title',
                        title: [
                            {
                                type: 'text',
                                text: {
                                    content: name
                                }
                            }
                        ]
                    },
                    '場所': {
                        type: 'select',
                        // @ts-ignore
                        select: {
                            name: place
                        }
                    }
                }
            }
        );
    }
}
