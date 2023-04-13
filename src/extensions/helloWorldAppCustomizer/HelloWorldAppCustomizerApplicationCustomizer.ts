import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { Dialog } from "@microsoft/sp-dialog";

import headerHtml from "./markdown/header.html";
import styles from "./styles/footer.module.scss";

import * as strings from "HelloWorldAppCustomizerApplicationCustomizerStrings";

const LOG_SOURCE: string = "HelloWorldAppCustomizerApplicationCustomizer";

export interface IHelloWorldAppCustomizerApplicationCustomizerProperties {}

export default class HelloWorldAppCustomizerApplicationCustomizer extends BaseApplicationCustomizer<IHelloWorldAppCustomizerApplicationCustomizerProperties> {
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(
      this,
      this._renderPlaceHolders
    );

    Dialog.alert("Updated Placeholders!").catch(console.error);

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    console.log(
      "Available application customizer placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map((name) => PlaceholderName[name])
        .join(", ")
    );

    // TOP PLACEHOLDER
    const topPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Top
    );

    if (!topPlaceholder) {
      console.error("The expected placeholder (Top) was not found.");
      return;
    }

    if (topPlaceholder.domElement) {
      topPlaceholder.domElement.innerHTML = headerHtml;
    }

    // BOTTOM PLACEHOLDER
    const bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Bottom
    );
    bottomPlaceholder.domElement.innerHTML = `<h2 class=${styles.footer}>Bottom Placeholder</h2>`;
  }
}
