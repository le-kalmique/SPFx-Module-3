import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters,
} from "@microsoft/sp-listview-extensibility";

import { ImageField, IProps } from "./components/ImageField";

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IImageFieldFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

export default class ImageFieldFieldCustomizer extends BaseFieldCustomizer<IImageFieldFieldCustomizerProperties> {
  public onInit(): Promise<void> {
    console.log("ImageFieldFieldCustomizer.onInit()");
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const image = event.fieldValue as string;

    const imageField: React.ReactElement<{}> = React.createElement(ImageField, {
      image,
      title: event.listItem.getValueByName("Title"),
    } as IProps);

    ReactDOM.render(imageField, event.domElement);
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
