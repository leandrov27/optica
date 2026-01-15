// schemas
import { type IComponent } from 'src/core/schemas';
// prisma
import { type Client, type MessageVariable } from 'prigen/client';

// ----------------------------------------------------------------------

const VAR_REGEX = /\{\{\s*(\d+)\s*\}\}/g;

type IResolveInput = {
  client: Client;
  variables: MessageVariable[];
};

// ----------------------------------------------------------------------

export function resolveTemplateVariables({ client, variables }: IResolveInput) {
  return variables
    .sort((a, b) => a.position - b.position)
    .map((variable) => {
      let value = '';

      switch (variable.source) {
        case 'CLIENT':
          value = (client as any)[variable.fieldPath ?? ''];
          break;

        case 'FIXED':
          value = variable.value ?? '';
          break;
      }

      return {
        type: 'text',
        text: String(value ?? ''),
      };
    });
}

export function extractVariablesFromComponents(components: IComponent[]) {
  const vars = new Set<number>();

  for (const c of components) {
    const text = c.text ?? '';
    let match: RegExpExecArray | null;

    while ((match = VAR_REGEX.exec(text)) !== null) {
      vars.add(Number(match[1]));
    }
  }

  return Array.from(vars).sort((a, b) => a - b);
}

export function countVariables(components: IComponent[]) {
  return extractVariablesFromComponents(components).length;
}

export function detectVariableLocation(components: IComponent[]) {
  let hasHeaderVars = false;
  let hasBodyVars = false;

  for (const c of components) {
    if (c.type === 'HEADER' && c.format === 'TEXT' && typeof c.text === 'string') {
      if (c.text.includes('{{')) hasHeaderVars = true;
    }

    if (c.type === 'BODY' && typeof c.text === 'string') {
      if (c.text.includes('{{')) hasBodyVars = true;
    }
  }

  return {
    header: hasHeaderVars,
    body: hasBodyVars,
  };
}

export function detectVariableLocationV2(components: IComponent[]) {
  let hasHeaderVars = false;
  let hasBodyVars = false;
  let headerFormat: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' = 'TEXT';

  for (const c of components) {
    if (c.type === 'HEADER') {
      headerFormat = c.format || 'TEXT';
      // Header needs parameters if it has {{}} OR if it's media (IMAGE, etc.)
      if ((c.text && c.text.includes('{{')) || c.format !== 'TEXT') {
        hasHeaderVars = true;
      }
    }

    if (c.type === 'BODY' && typeof c.text === 'string') {
      if (c.text.includes('{{')) hasBodyVars = true;
    }
  }

  return {
    header: hasHeaderVars,
    body: hasBodyVars,
    headerFormat,
  };
}
