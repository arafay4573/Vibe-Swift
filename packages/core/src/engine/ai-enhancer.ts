import { VibeComponent } from '../types/blueprint.js';

export class AIEnhancer {
  /**
   * Refines a component with semantic accessibility, type safety, and clean props.
   */
  static refineComponent(component: VibeComponent, prompt?: string): VibeComponent {
    const refined = { ...component };

    // Ensure className prop exists
    if (!refined.props.some((p) => p.name === 'className')) {
      refined.props.push({
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: '""',
        description: 'Optional additional CSS utility classes',
      });
    }

    // Enhance props based on category
    if (refined.category === 'hero' && !refined.props.some((p) => p.name === 'title')) {
      refined.props.push({
        name: 'title',
        type: 'string',
        required: false,
        defaultValue: '"Next-Gen Reverse Engineering"',
        description: 'Headline text for the hero',
      });
      refined.props.push({
        name: 'subtitle',
        type: 'string',
        required: false,
        defaultValue: '"Deconstruct and rebuild web architectures with agent-guided precision."',
        description: 'Subtitle explanation',
      });
    }

    if (refined.category === 'card' && !refined.props.some((p) => p.name === 'items')) {
      refined.props.push({
        name: 'items',
        type: 'array',
        required: false,
        defaultValue: '[]',
        description: 'Array of card data items',
      });
    }

    return refined;
  }

  /**
   * Generate an AI prompt for an LLM agent to review or customize a component.
   */
  static generateRefinementPrompt(component: VibeComponent, goal: string): string {
    return `
You are the Vibe Swift AI Engineering Agent.
Target Component: ${component.name} (${component.category})
Current Tailwind Classes: ${component.tailwindClasses.join(' ')}
Goal: ${goal}

Please inspect the component, ensure full mobile responsiveness, ARIA accessibility, strict TypeScript types, and seamless Tailwind CSS integration. Return the updated TypeScript React code.
`.trim();
  }
}
