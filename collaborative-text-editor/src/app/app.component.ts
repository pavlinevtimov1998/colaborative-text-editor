import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
//@ts-ignore
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import SelectPlugin from './selectPlugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor', { static: true }) editorElementRef!: ElementRef;

  private yDoc!: Y.Doc;
  private provider!: WebsocketProvider;

  isConnected = true;

  constructor() {}

  ngAfterViewInit(): void {
    this.yDoc = new Y.Doc();
    this.provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      'simple-collaborative-text-editor',
      this.yDoc
    );
    const yXmlFragment = this.yDoc.getXmlFragment('prosemirror');

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    });

    new EditorView(this.editorElementRef.nativeElement, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(
          this.editorElementRef.nativeElement
        ),
        plugins: [
          ySyncPlugin(yXmlFragment),
          yCursorPlugin(this.provider.awareness),
          yUndoPlugin(),
          ...exampleSetup({ schema: mySchema }),
          SelectPlugin,
        ],
      }),
    });
  }

  connectionBtnHandler() {
    if (this.provider.shouldConnect) {
      this.provider.disconnect();
      this.isConnected = false;
    } else {
      this.provider.connect();
      this.isConnected = true;
    }
  }
}
