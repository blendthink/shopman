import {
    Page,
    PropertyValue,
    SelectPropertyValue,
    TitlePropertyValue,
} from '@notionhq/client/build/src/api-types';

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
