import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToolbarService, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { TitleBar } from './title-bar';
import { defaultDocument, WEB_API_ACTION } from './data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeView, DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { closest } from '@syncfusion/ej2-base';

/**
 * Document Editor Component
 */
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService]
})
export class AppComponent {
    public hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
    @ViewChild('container')
    public container: DocumentEditorContainerComponent;
    titleBar: TitleBar;
    data = {
"defaultData": [
        { "id": "01", "name": "Local Disk (C:)", "expanded": true,
            "subChild": [
                {
                    "id": "01-01", "name": "Program Files",
                    "subChild": [
                        { "id": "01-01-01", "name": "Windows NT" },
                        { "id": "01-01-02", "name": "Windows Mail" },
                        { "id": "01-01-03", "name": "Windows Photo Viewer" }
                    ]
                },
                {
                    "id": "01-02", "name": "Users", "expanded": true,
                    "subChild": [
                        { "id": "01-02-01", "name": "Smith" },
                        { "id": "01-02-02", "name": "Public" },
                        { "id": "01-02-03", "name": "Admin" }
                    ]
                },
                {
                    "id": "01-03", "name": "Windows",
                    "subChild": [
                        { "id": "01-03-01", "name": "Boot" },
                        { "id": "01-03-02", "name": "FileManager" },
                        { "id": "01-03-03", "name": "System32" }
                    ]
                }
            ]
        },
        {
            "id": "02", "name": "Local Disk (D:)",
            "subChild": [
                {
                    "id": "02-01", "name": "Personals",
                    "subChild": [
                        { "id": "02-01-01", "name": "My photo.png" },
                        { "id": "02-01-02", "name": "Rental document.docx" },
                        { "id": "02-01-03", "name": "Pay slip.pdf" }
                    ]
                },
                {
                    "id": "02-02", "name": "Projects",
                    "subChild": [
                        { "id": "02-02-01", "name": "ASP Application" },
                        { "id": "02-02-02", "name": "TypeScript Application" },
                        { "id": "02-02-03", "name": "React Application" }
                    ]
                },
                {
                    "id": "02-03", "name": "Office",
                    "subChild": [
                        { "id": "02-03-01", "name": "Work details.docx" },
                        { "id": "02-03-02", "name": "Weekly report.docx" },
                        { "id": "02-03-03", "name": "Wish list.csv" }
                    ]
                }
            ]
        },
        {
            "id": "03", "name": "Local Disk (E:)", "icon": "folder",
            "subChild": [
                {
                    "id": "03-01", "name": "Pictures",
                    "subChild": [
                        { "id": "03-01-01", "name": "Wind.jpg" },
                        { "id": "03-01-02", "name": "Stone.jpg" },
                        { "id": "03-01-03", "name": "Home.jpg" }
                    ]
                },
                {
                    "id": "03-02", "name": "Documents",
                        "subChild": [
                        { "id": "03-02-01", "name": "Environment Pollution.docx" },
                        { "id": "03-02-02", "name": "Global Warming.ppt" },
                        { "id": "03-02-03", "name": "Social Network.pdf" }
                    ]
                },
                {
                    "id": "03-03", "name": "Study Materials",
                    "subChild": [
                        { "id": "03-03-01", "name": "UI-Guide.pdf" },
                        { "id": "03-03-02", "name": "Tutorials.zip" },
                        { "id": "03-03-03", "name": "TypeScript.7z" }
                    ]
                }
            ]
        }
    ]
};
    fields = {
      dataSource: this.data.defaultData,
      id: "id",
      text: "name",
      child: "subChild"
    };
    public allowDragAndDrop:boolean = true;
    onCreate(): void {
        let titleBarElement: HTMLElement = document.getElementById('default_title_bar');
        this.titleBar = new TitleBar(titleBarElement, this.container.documentEditor, true);
        this.container.locale = 'en-US';
        this.container.element.classList.add("e-droppable");
        this.container.serviceUrl = this.hostUrl + WEB_API_ACTION;
        this.container.documentEditor.open(JSON.stringify(defaultDocument));
        this.container.documentEditor.documentName = 'Getting Started';
        this.titleBar.updateDocumentTitle();
    }

    onDocumentChange(): void {
        if (!isNullOrUndefined(this.titleBar)) {
            this.titleBar.updateDocumentTitle();
        }
        this.container.documentEditor.focusIn();
    }
     onDragStop(args):void {
    let targetEle = closest(args.target, ".e-droppable");
    targetEle = targetEle ? targetEle : args.target;
    // Check the target as document editor or not
    if (
      targetEle &&
      targetEle.classList.contains("e-documenteditorcontainer")
    ) {
      args.cancel = true;
      if (args.draggedNode.classList.contains("e-list-item")) {
        let nodeEle = args.draggedNode.querySelector(".e-list-text");
        let nodeText = nodeEle.textContent;
        var text = nodeText
          .replace(/\n/g, "")
          .replace(/\r/g, "")
          .replace(/\r\n/g, "");
        this.container.documentEditor.editor.insertField(
          "MERGEFIELD " + text + " \\* MERGEFORMAT"
        );
      }
    }
  }
  onDragStart(args):void {
    if (args.draggedNode.classList.contains("e-has-child")) {
      args.cancel = true;
    }
  }
  onDragging(args):void {
    this.container.documentEditor.selection.select({
      x: args.event.offsetX,
      y: args.event.offsetY,
      extend: false
    });
  }
}