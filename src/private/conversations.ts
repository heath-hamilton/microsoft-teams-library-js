import { ensureInitialized, sendMessageRequestToParent } from '../internal/internalAPIs';
import { GlobalVars } from '../internal/globalVars';
import { FrameContexts } from '../public/constants';
import { OpenConversationRequest } from '../public/interfaces';

/**
 * Namespace to interact with the conversational subEntities inside the tab
 */
export namespace conversations {
  /**
   * @private
   * Hide from docs
   * --------------
   * Allows the user to start or continue a conversation with each subentity inside the tab
   */
  export function openConversation(openConversationRequest: OpenConversationRequest): void {
    ensureInitialized(FrameContexts.content);
    const messageId = sendMessageRequestToParent('conversations.openConversation', [
      {
        title: openConversationRequest.title,
        subEntityId: openConversationRequest.subEntityId,
        conversationId: openConversationRequest.conversationId,
        channelId: openConversationRequest.channelId,
        entityId: openConversationRequest.entityId,
      },
    ]);
    GlobalVars.onCloseConversationHandler = openConversationRequest.onCloseConversation;
    GlobalVars.onStartConversationHandler = openConversationRequest.onStartConversation;
    GlobalVars.callbacks[messageId] = (status: boolean, reason: string) => {
      if (!status) {
        throw new Error(reason);
      }
    };
  }

  /**
   * @private
   * Hide from docs
   * --------------
   * Allows the user to close the conversation in the right pane
   */
  export function closeConversation(): void {
    ensureInitialized(FrameContexts.content);
    sendMessageRequestToParent('conversations.closeConversation');
    GlobalVars.onCloseConversationHandler = null;
    GlobalVars.onStartConversationHandler = null;
  }
}
