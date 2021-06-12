import {Option, View} from '@slack/bolt';
import {ViewStateValue} from '@slack/bolt/dist/types/view';

export const CALLBACK_ID_ADD_ITEM = "callback_add_item";

export const BLOCK_ID_NAME = 'block_name';
export const ACTION_ID_NAME = 'action_name';

export const BLOCK_ID_PLACE = 'block_place';
export const ACTION_ID_PLACE = 'action_place';

export function getItemInfo(
    viewStateValues: {
        [blockId: string]: {
            [actionId: string]: ViewStateValue;
        };
    }
): [string, string] {

    const name = viewStateValues[BLOCK_ID_NAME][ACTION_ID_NAME].value!;
    const place = viewStateValues[BLOCK_ID_PLACE][ACTION_ID_PLACE].selected_option?.value!;

    return [name, place];
}

export function generateModalAddItemView(placeList: string[]): View {

    function generateOption(place: string): Option {
        return {
            "text": {
                "type": "plain_text",
                "text": `${place}`,
                "emoji": true
            },
            "value": `${place}`
        };
    }

    const options = placeList.map(value => generateOption(value));

    return {
        "type": "modal",
        "callback_id": CALLBACK_ID_ADD_ITEM,
        "title": {
            "type": "plain_text",
            "text": "買い物リストに追加する"
        },
        "blocks": [
            {
                "type": "input",
                "block_id": BLOCK_ID_NAME,
                "label": {
                    "type": "plain_text",
                    "text": "名前"
                },
                "element": {
                    "type": "plain_text_input",
                    "action_id": ACTION_ID_NAME,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "例）牛乳"
                    }
                }
            },
            {
                "type": "input",
                "block_id": BLOCK_ID_PLACE,
                "label": {
                    "type": "plain_text",
                    "text": "場所",
                    "emoji": true
                },
                "element": {
                    "type": "static_select",
                    "action_id": ACTION_ID_PLACE,
                    "placeholder": {
                        "type": "plain_text",
                        "text": "例）冷蔵庫",
                        "emoji": true
                    },
                    "options": options
                }
            }
        ],
        "submit": {
            "type": "plain_text",
            "text": "Submit"
        }
    };
}
