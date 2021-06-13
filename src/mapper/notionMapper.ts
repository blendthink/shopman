import {Item} from '../data/item';
import {Page} from '@notionhq/client/build/src/api-types';
import {NotionUtil} from '../util/notionUtil';
import {NAME_KEY, PLACE_KEY} from '../const/notionConst';

export class NotionMapper {

    static toItems(pages: Page[]): Item[] {
        return pages.map(page => {
            const name = NotionUtil.getPageTitle(page, NAME_KEY);
            const place = NotionUtil.getPageSelectName(page, PLACE_KEY);
            return new Item(name, place);
        });
    }
}
