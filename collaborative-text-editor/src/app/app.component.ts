import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
//@ts-ignore
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';

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

  constructor() {}

  ngAfterViewInit(): void {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    });

    new EditorView(this.editorElementRef.nativeElement, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(
          this.editorElementRef.nativeElement
        ),
        plugins: [...exampleSetup({ schema: mySchema }), SelectPlugin],
      }),
    });
  }
}
