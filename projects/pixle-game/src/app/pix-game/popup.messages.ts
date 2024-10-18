import { IPopUp } from '@interface/popup-message.interface';
import { SUPPORT_EMAIL } from '../app.component';

export const MISSING_PIXLE_MSG: IPopUp = {
  headline: 'Missing pixle data!',
  subline: 'There was a mistake retrieving a pixle from the database.',
  message_body:
    'If this issue occurs more often than it should, report it to the team.</br>' +
    '<a class="share-via-mail" href="mailto:' +
    SUPPORT_EMAIL +
    '">' +
    SUPPORT_EMAIL +
    '</a>',
};
export const SUCCESS_PIXLE_MSG: IPopUp = {
  headline: 'Congratulations!',
  subline: '',
  message_body:
    "You've made it, keep going!</br>Challenge your friends and family by sharing your score.",
};
export const FAILED_PIXLE_MSG: IPopUp = {
  headline: 'No way!',
  subline: '',
  message_body:
    "This is it... . You've lost.</br>But i'm believing in you, hang in there!",
};
