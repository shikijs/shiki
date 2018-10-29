/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import { IRawGrammar, IOnigLib, parseRawGrammar, RegistryOptions, Thenable } from 'vscode-textmate';

import * as path from 'path';
import * as fs from 'fs';

export interface ILanguageRegistration {
	id: string;
	extensions: string[];
	aliases: string[];
	filenames: string[];
}

export interface IGrammarRegistration {
	language: string;
	scopeName: string;
	path: string;
	embeddedLanguages: { [scopeName: string]: string; };
	grammar?: Thenable<IRawGrammar>;
}

export class Resolver implements RegistryOptions {
	public readonly language2id: { [languages: string]: number; };
	private _lastLanguageId: number;
	private _id2language: string[];
	private readonly _grammars: IGrammarRegistration[];
	private readonly _languages: ILanguageRegistration[];
	private readonly _onigLibPromise: Thenable<IOnigLib>;
	private readonly _onigLibName: string;

	constructor(grammars: IGrammarRegistration[], languages: ILanguageRegistration[], onigLibPromise: Thenable<IOnigLib>, onigLibName: string) {
		this._grammars = grammars;
		this._languages = languages;
		this._onigLibPromise = onigLibPromise;
		this._onigLibName = onigLibName;

		this.language2id = Object.create(null);
		this._lastLanguageId = 0;
		this._id2language = [];

		for (let i = 0; i < this._languages.length; i++) {
			let languageId = ++this._lastLanguageId;
			this.language2id[this._languages[i].id] = languageId;
			this._id2language[languageId] = this._languages[i].id;
		}
	}

	public getOnigLib(): Thenable<IOnigLib> {
		return this._onigLibPromise;
	}

	public getOnigLibName(): string {
		return this._onigLibName;
	}

	public findLanguageByExtension(fileExtension: string): string {
		for (let i = 0; i < this._languages.length; i++) {
			let language = this._languages[i];

			if (!language.extensions) {
				continue;
			}

			for (let j = 0; j < language.extensions.length; j++) {
				let extension = language.extensions[j];

				if (extension === fileExtension) {
					return language.id;
				}
			}
		}

		return null;
	}

	public findLanguageByFilename(filename: string): string {
		for (let i = 0; i < this._languages.length; i++) {
			let language = this._languages[i];

			if (!language.filenames) {
				continue;
			}

			for (let j = 0; j < language.filenames.length; j++) {
				let lFilename = language.filenames[j];

				if (filename === lFilename) {
					return language.id;
				}
			}
		}

		return null;
	}

	public findScopeByFilename(filename: string): string {
		let language = this.findLanguageByExtension(path.extname(filename)) || this.findLanguageByFilename(filename);
		if (language) {
			let grammar = this.findGrammarByLanguage(language);
			if (grammar) {
				return grammar.scopeName;
			}
		}
		return null;
	}

	public findGrammarByLanguage(language: string): IGrammarRegistration {
		for (let i = 0; i < this._grammars.length; i++) {
			let grammar = this._grammars[i];

			if (grammar.language === language) {
				return grammar;
			}
		}

		throw new Error('Could not findGrammarByLanguage for ' + language);
	}

	public loadGrammar(scopeName: string): Thenable<IRawGrammar | null> {
		for (let i = 0; i < this._grammars.length; i++) {
			let grammar = this._grammars[i];
			if (grammar.scopeName === scopeName) {
				if (!grammar.grammar) {
					grammar.grammar = readGrammarFromPath(grammar.path);
				}
				return grammar.grammar;
			}
		}
		//console.warn('test resolver: missing grammar for ' + scopeName);
		return null;
	}
}

function readGrammarFromPath(path: string) : Thenable<IRawGrammar> {
	return new Promise((c,e) => {
		fs.readFile(path, (error, content) => {
			if (error) {
				e(error);
			} else {
				c(parseRawGrammar(content.toString(), path));
			}
		});
	});
}