import { Log } from "@microsoft/sp-core-library";
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs,
  RowAccessor,
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from "@microsoft/sp-dialog";
import { sp } from "@pnp/sp/presets/all";
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = "CommandSetCommandSet";

export default class CommandSetCommandSet extends BaseListViewCommandSet<ICommandSetCommandSetProperties> {
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized CommandSetCommandSet");

    this.context.listView.listViewStateChangedEvent.add(
      this,
      this._onListViewStateChanged
    );

    // Hide the commands by default
    const one_item_selected: Command = this.tryGetCommand(
      "UPDATE_RELEASE_DATE"
    );
    if (one_item_selected) {
      one_item_selected.visible = false;
    }
    const two_item_selected: Command = this.tryGetCommand("COMPARE");
    if (two_item_selected) {
      two_item_selected.visible = false;
    }

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "COMMAND_1":
        Dialog.alert(`${this.properties.sampleTextOne}`).catch(() => {
          /* handle error */
        });
        break;
      case "COMMAND_2":
        Dialog.alert(`${this.properties.sampleTextTwo}`).catch(() => {
          /* handle error */
        });
        break;
      case "COMPARE":
        this._compareProducts([...event.selectedRows]);
        break;
      case "UPDATE_RELEASE_DATE":
        this._updateReleaseDate(event.selectedRows?.[0]);
        break;
      default:
        throw new Error("Unknown command");
    }
  }

  private _updateReleaseDate = (product: RowAccessor): void => {
    const productId = product.getValueByName("ID");
    const newRealaseDate = new Date();

    sp.web.lists
      .getByTitle("Products")
      .items.getById(productId)
      .update({
        ReleaseDate: newRealaseDate,
      })
      .then(() => {
        location.reload();
        return Dialog.alert(
          `Product ${product.getValueByName(
            "Title"
          )} release date has been updated to ${newRealaseDate}. Reload the page to see the changes.`
        );
      })
      .catch(console.error);
  };

  private _compareProducts = (products: RowAccessor[]): void => {
    console.log(products);

    const firstRating = products[0].getValueByName("CustomerRating");
    const secondRating = products[1].getValueByName("CustomerRating");

    if (firstRating > secondRating) {
      Dialog.alert(
        `Product ${products[0].getValueByName(
          "Title"
        )} has a higher rating ${firstRating} than ${products[1].getValueByName(
          "Title"
        )} ${secondRating}`
      ).catch(() => {
        /* handle error */
      });
    } else {
      Dialog.alert(
        `Product ${products[1].getValueByName(
          "Title"
        )} has a higher rating ${secondRating} than ${products[0].getValueByName(
          "Title"
        )} ${firstRating}`
      ).catch(() => {
        /* handle error */
      });
    }
  };

  private _onListViewStateChanged = (
    args: ListViewStateChangedEventArgs
  ): void => {
    Log.info(LOG_SOURCE, "List view state changed");

    const one_item_selected: Command = this.tryGetCommand(
      "UPDATE_RELEASE_DATE"
    );
    if (one_item_selected) {
      one_item_selected.visible =
        this.context.listView.selectedRows?.length === 1;
    }
    const two_item_selected: Command = this.tryGetCommand("COMPARE");
    if (two_item_selected) {
      two_item_selected.visible =
        this.context.listView.selectedRows?.length === 2;
    }

    // You should call this.raiseOnChange() to update the command bar
    this.raiseOnChange();
  };
}
