import { IPopUp } from '@interface/popup-message.interface';
import { SUPPORT_EMAIL } from '../app.component';

export const MISSING_PIXLE_MSG: IPopUp = {
  headline: 'Missing pixle data!',
  subline: "Something went wrong while creating today's pixle.",
  message_body:
    "Something went wrong while creating today's pixle.<br>" +
    'If this keeps happening, please let us know:<br>' +
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
    "You've made it, keep going!<br>Challenge your friends and family by sharing your score.",
};
export const FAILED_PIXLE_MSG: IPopUp = {
  headline: 'No way!',
  subline: '',
  message_body:
    "That's it, you've lost.<br>But I believe in you, hang in there!",
};
