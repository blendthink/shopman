import {
    Page,
    PropertyValue,
    SelectPropertyValue,
    TitlePropertyValue,
} from '@notionhq/client/build/src/api-types';

export class NotionUtil {
    static getPageTitle(page: Page, key: string): string {
        const propertyValue: PropertyValue = page.properties[key];
        if (!NotionUtil.isTitlePropertyValue(propertyValue)) {
            throw TypeError;
        }
        return propertyValue.title[0].plain_text;
    }

    static getPageSelectName(page: Page, key: string): string {
        const propertyValue: PropertyValue = page.properties[key];
        if (!NotionUtil.isSelectPropertyValue(propertyValue)) {
            throw TypeError;
        }
        return propertyValue.select.name;
    }

    private static isTitlePropertyValue(value: PropertyValue): value is TitlePropertyValue {
        return (value as TitlePropertyValue).id !== undefined &&
            (value as TitlePropertyValue).type !== undefined &&
            (value as TitlePropertyValue).title !== undefined;
    }

    private static isSelectPropertyValue(value: PropertyValue): value is SelectPropertyValue {
        return (value as SelectPropertyValue).id !== undefined &&
            (value as SelectPropertyValue).type !== undefined &&
            (value as SelectPropertyValue).select !== undefined;
    }
}
