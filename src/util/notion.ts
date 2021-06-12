import {Client} from '@notionhq/client';

const notionClient = new Client(
    {
        auth: process.env.NOTION_TOKEN,
    }
);

import {
    Page,
    PropertyValue,
    SelectPropertyValue,
    TitlePropertyValue,
    SelectProperty,
} from '@notionhq/client/build/src/api-types';
import {AssertionError} from 'assert';

export async function getPlaceList(): Promise<string[]> {
    const res = await notionClient.databases.retrieve(
        {
            database_id: process.env.DATABASE_ID!
        }
    );

    const propertyPlace = res.properties["場所"] as SelectProperty;
    const placeList = propertyPlace.select.options.map(value => value.name);
    if (placeList.length == 0) {
        throw AssertionError;
    }

    return placeList;
}

export async function createItem(name: string, place: string) {
    // noinspection NonAsciiCharacters
    await notionClient.pages.create(
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
                                content: `${name}`
                            }
                        }
                    ]
                },
                '場所': {
                    type: 'select',
                    // @ts-ignore
                    select: {
                        name: `${place}`
                    }
                }
            }
        }
    );
}

export function getPageName(page: Page): string {
    const propertyValue: PropertyValue = page.properties['名前'];
    if (!isTitlePropertyValue(propertyValue)) {
        throw TypeError;
    }
    return propertyValue.title[0].plain_text;
}

export function getPagePlace(page: Page): string {
    const propertyValue: PropertyValue = page.properties['場所'];
    if (!isSelectPropertyValue(propertyValue)) {
        throw TypeError;
    }
    return propertyValue.select.name;
}

function isTitlePropertyValue(value: PropertyValue): value is TitlePropertyValue {
    return (value as TitlePropertyValue).id !== undefined &&
        (value as TitlePropertyValue).type !== undefined &&
        (value as TitlePropertyValue).title !== undefined;
}

function isSelectPropertyValue(value: PropertyValue): value is SelectPropertyValue {
    return (value as SelectPropertyValue).id !== undefined &&
        (value as SelectPropertyValue).type !== undefined &&
        (value as SelectPropertyValue).select !== undefined;
}
