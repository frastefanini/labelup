// Type definitions for Atlassian Connect JavaScript client library
// Project: Atlassian Connect
// Definitions by: Ripe Engineering Team <info@teamripe.com>

/**
 * The Javascript client library for Atlassian Connect.
 */
declare namespace AP {

  /**
   * Resize the iframe to a specified width and height.
   *
   * Only content within an element with the class ac-content will be resized automatically.
   * Content without this identifier is sized according to the body element, and will dynamically grow, but not shrink.
   *
   * Note that this method cannot be used in dialogs.
   *
   * @param width the desired width
   * @param height the desired height
   */
  export function resize(width:string, height:string): void

  /**
   * A JavaScript module which provides functions for the current product context.
   */
  namespace context {

    interface ConfluenceContent {
      id: string
      type: string
      version: string
    }

    interface ConfluenceSpace {
      id: string
      key: string
    }

    interface ConfluenceContext {
      content?: ConfluenceContent
      space?: ConfluenceSpace
    }

    interface Context {
      confluence?: ConfluenceContext
    }

    /**
     * Retrieves the current user context as a JWT token containing details such as space key, issue id, etc.
     * Throws an error if add-on does not support JWT authentication
     */
    export function getToken(): Promise<string>

    /**
     * Retrieves the current user context containing details such as space key, issue id, etc.
     */
    export function getContext(): Promise<Context>
  }

  /**
   * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
   */
  namespace dialog {

    interface Dialog {}

    interface DialogOptions {

      /**
       * The module key of a dialog, or the key of a page or web-item that you want to open as a dialog.
       *
       * @param options configuration object of dialog options.
       */
      key: string
    }

    export function create(options:DialogOptions): Dialog


    /**
     * Closes the currently open dialog. Optionally pass data to listeners of the dialog.close event.
     * This will only close a dialog that has been opened by your add-on.
     * You can register for close events using the dialog.close event and the events module.
     *
     * @param data An object to be emitted on dialog close.
     */
    export function close(data:object): void
  }

  /**
   * Flags are the primary method for providing system feedback in the product user interface.
   * Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
   */
  namespace flag {

    type FlagType = "info" | "success" | "warning" | "error" | string
    type FlagClosingBehaviour = "manual" | "auto" | string

    interface FlagOptions {

      /**
       * The title text of the flag.
       */
      title: string

      /**
       * The body text of the flag.
       */
      body: string

      /**
       * Sets the type of the message.
       */
      type: FlagType

      /**
       * The closing behaviour that this flag has.
       */
      close: FlagClosingBehaviour
    }

    interface Flag {

      /**
       * Closes the Flag.
       */
      close(): void
    }

    /**
     * Creates a new flag.
     *
     * @param options Options of the flag.
     */
    export function create(options:FlagOptions): Flag
  }

  /**
   * The inline dialog is a wrapper for secondary content/controls to be displayed on user request.
   */
  namespace inlineDialog {

    /**
     * Hide the inline dialog that contains the iframe where this method is called from.
     */
    export function hide(): void
  }

  /**
   * The Navigator API allows your add-on to change the current page using JavaScript.
   */
  namespace navigator {

    type NavigatorTarget = "contentview" | string

    interface NavigatorContext {

      /**
       * Identifies a piece of content. Required for the contentView target.
       */
      contentId?: string

      /**
       * Identifies a version of a piece of content in Confluence. This parameter is optional, and only applies to the contentView target, allowing navigation to a specific version.
       */
      versionOverride?: number
    }

    /**
     * Navigates the user from the current page to the specified page. This call navigates the host product, not the iframe content.
     *
     * Requires a target location and the corresponding context. Navigating by passing a concrete url is currently unsupported.
     *
     * @param target The type of page to navigate to.
     * @param context Specific information that identifies the page to navigate to.
     *
     */
    export function go(target:NavigatorTarget, context:NavigatorContext): void
  }
}
