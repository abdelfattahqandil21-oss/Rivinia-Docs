import type { CodeLanguage } from '../../../../shared/utils/code-highlight';

export interface DocsNode {
  readonly type: string;
  readonly color?: string;
  readonly name?: string;
  readonly text?: string;
  readonly code?: string;
  readonly language?: Exclude<CodeLanguage, 'typescript'>;
  readonly id?: string;
  readonly level?: number;
  readonly href?: string;
  readonly external?: boolean;
  readonly children?: readonly DocsNode[];
  readonly ordered?: boolean;
  readonly start?: number;
  readonly items?: readonly (readonly DocsNode[])[];
  readonly align?: readonly (string | null)[];
  readonly header?: readonly (readonly DocsNode[])[];
  readonly rows?: readonly (readonly (readonly DocsNode[])[])[];
}
export interface DocsPage {
  readonly package: string;
  readonly section: string;
  readonly route: string;
  readonly title: string;
  readonly summary: string;
  readonly order: number;
  readonly group?: string;
  readonly chip?: string;
  readonly sources: readonly string[];
  readonly nodes: readonly DocsNode[];
}
