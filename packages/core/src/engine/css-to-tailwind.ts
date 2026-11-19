/**
 * Intelligent CSS to Tailwind CSS utility class converter
 */
export class CssToTailwind {
  private static styleMap: Record<string, (val: string) => string | null> = {
    display: (v) => {
      if (v === 'flex') return 'flex';
      if (v === 'grid') return 'grid';
      if (v === 'inline-flex') return 'inline-flex';
      if (v === 'block') return 'block';
      if (v === 'inline-block') return 'inline-block';
      if (v === 'none') return 'hidden';
      return null;
    },
    'flex-direction': (v) => (v === 'column' ? 'flex-col' : v === 'row' ? 'flex-row' : null),
    'align-items': (v) => {
      if (v === 'center') return 'items-center';
      if (v === 'flex-start' || v === 'start') return 'items-start';
      if (v === 'flex-end' || v === 'end') return 'items-end';
      if (v === 'stretch') return 'items-stretch';
      return null;
    },
    'justify-content': (v) => {
      if (v === 'center') return 'justify-center';
      if (v === 'space-between') return 'justify-between';
      if (v === 'space-around') return 'justify-around';
      if (v === 'flex-start' || v === 'start') return 'justify-start';
      if (v === 'flex-end' || v === 'end') return 'justify-end';
      return null;
    },
    position: (v) => {
      if (['relative', 'absolute', 'fixed', 'sticky'].includes(v)) return v;
      return null;
    },
    'font-weight': (v) => {
      if (v === 'bold' || v === '700') return 'font-bold';
      if (v === '600' || v === 'semi-bold') return 'font-semibold';
      if (v === '500') return 'font-medium';
      if (v === 'normal' || v === '400') return 'font-normal';
      return null;
    },
    'text-align': (v) => {
      if (['center', 'left', 'right', 'justify'].includes(v)) return `text-${v}`;
      return null;
    },
    'border-radius': (v) => {
      const px = parseInt(v, 10);
      if (isNaN(px)) return null;
      if (px <= 4) return 'rounded-sm';
      if (px <= 8) return 'rounded-md';
      if (px <= 12) return 'rounded-lg';
      if (px <= 16) return 'rounded-xl';
      if (px <= 24) return 'rounded-2xl';
      if (px >= 999 || v.includes('50%')) return 'rounded-full';
      return `rounded-[${v}]`;
    },
    padding: (v) => CssToTailwind.mapSpacing('p', v),
    margin: (v) => CssToTailwind.mapSpacing('m', v),
    gap: (v) => CssToTailwind.mapSpacing('gap', v),
  };

  private static mapSpacing(prefix: string, val: string): string {
    const px = parseInt(val, 10);
    if (isNaN(px)) return `${prefix}-[${val}]`;
    const twUnit = Math.round(px / 4);
    return `${prefix}-${twUnit}`;
  }

  /**
   * Convert a key-value CSS rules record into an array of Tailwind classes.
   */
  static convertRules(rules: Record<string, string>): string[] {
    const classes: string[] = [];

    for (const [key, rawVal] of Object.entries(rules)) {
      const prop = key.trim().toLowerCase();
      const val = rawVal.trim().toLowerCase();

      if (this.styleMap[prop]) {
        const cls = this.styleMap[prop](val);
        if (cls) {
          classes.push(cls);
          continue;
        }
      }

      // Check colors
      if (prop === 'background-color' || prop === 'background') {
        if (val === 'transparent') classes.push('bg-transparent');
        else if (val === '#fff' || val === '#ffffff' || val === 'white') classes.push('bg-white');
        else if (val === '#000' || val === '#000000' || val === 'black') classes.push('bg-black');
        else if (val.startsWith('#')) classes.push(`bg-[${val}]`);
      } else if (prop === 'color') {
        if (val === '#fff' || val === '#ffffff' || val === 'white') classes.push('text-white');
        else if (val === '#000' || val === '#000000' || val === 'black') classes.push('text-black');
        else if (val.startsWith('#')) classes.push(`text-[${val}]`);
      }
    }

    return classes;
  }
}
