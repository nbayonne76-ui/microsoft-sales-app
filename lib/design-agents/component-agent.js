/**
 * Component Agent - Specialized agent for generating UI component specifications
 * Part of the Multi-Agent UI Designer System
 */

export class ComponentAgent {
  constructor() {
    this.name = 'ComponentAgent';
    this.specialization = 'ui_components';
  }

  /**
   * Generate component design specifications
   */
  async generateComponents({ componentTypes, interactionStyle, accessibility }) {
    console.log(`🧩 [ComponentAgent] Generating components with ${interactionStyle} interaction style...`);

    const components = [];

    // Button components
    if (!componentTypes || componentTypes.includes('buttons')) {
      components.push({
        category: 'buttons',
        variants: [
          {
            id: 'btn_primary',
            name: 'Primary Button',
            styles: {
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              states: {
                default: { background: 'var(--color-primary)', color: '#fff' },
                hover: { background: 'var(--color-primary-dark)', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                active: { transform: 'translateY(0)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                disabled: { opacity: 0.5, cursor: 'not-allowed' },
                focus: { outline: '2px solid var(--color-primary)', outlineOffset: '2px' }
              }
            },
            accessibility: {
              ariaLabel: true,
              focusVisible: true,
              keyboardNav: true
            }
          },
          {
            id: 'btn_secondary',
            name: 'Secondary Button',
            styles: {
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              border: '2px solid var(--color-primary)',
              transition: 'all 0.2s ease',
              states: {
                default: { background: 'transparent', color: 'var(--color-primary)' },
                hover: { background: 'var(--color-primary)', color: '#fff' },
                active: { transform: 'scale(0.98)' },
                disabled: { opacity: 0.5, cursor: 'not-allowed' }
              }
            }
          },
          {
            id: 'btn_ghost',
            name: 'Ghost Button',
            styles: {
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              states: {
                default: { background: 'transparent', color: 'var(--color-text)' },
                hover: { background: 'var(--color-surface)', color: 'var(--color-primary)' },
                active: { background: 'var(--color-surface-dark)' }
              }
            }
          }
        ]
      });
    }

    // Input components
    if (!componentTypes || componentTypes.includes('inputs')) {
      components.push({
        category: 'inputs',
        variants: [
          {
            id: 'input_text',
            name: 'Text Input',
            styles: {
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s ease',
              states: {
                default: { background: '#fff', color: 'var(--color-text)' },
                focus: {
                  borderColor: 'var(--color-primary)',
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                },
                error: {
                  borderColor: 'var(--color-error)',
                  boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
                },
                disabled: { background: 'var(--color-surface)', cursor: 'not-allowed' }
              }
            },
            accessibility: {
              label: true,
              placeholder: true,
              ariaDescribedBy: true,
              errorMessage: true
            }
          }
        ]
      });
    }

    // Card components
    if (!componentTypes || componentTypes.includes('cards')) {
      components.push({
        category: 'cards',
        variants: [
          {
            id: 'card_elevated',
            name: 'Elevated Card',
            styles: {
              padding: '24px',
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              states: {
                default: { transform: 'translateY(0)' },
                hover: {
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)'
                }
              }
            }
          },
          {
            id: 'card_outlined',
            name: 'Outlined Card',
            styles: {
              padding: '24px',
              borderRadius: '12px',
              background: '#fff',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s ease',
              states: {
                default: {},
                hover: { borderColor: 'var(--color-primary)' }
              }
            }
          },
          {
            id: 'card_glass',
            name: 'Glassmorphic Card',
            styles: {
              padding: '24px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }
          }
        ]
      });
    }

    // Navigation components
    if (!componentTypes || componentTypes.includes('navigation')) {
      components.push({
        category: 'navigation',
        variants: [
          {
            id: 'nav_horizontal',
            name: 'Horizontal Navigation',
            styles: {
              display: 'flex',
              gap: '8px',
              padding: '16px 24px',
              background: '#fff',
              borderBottom: '1px solid var(--color-border)',
              item: {
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                states: {
                  default: { color: 'var(--color-text-secondary)' },
                  hover: { background: 'var(--color-surface)', color: 'var(--color-primary)' },
                  active: { background: 'var(--color-primary)', color: '#fff' }
                }
              }
            }
          },
          {
            id: 'nav_sidebar',
            name: 'Sidebar Navigation',
            styles: {
              width: '280px',
              padding: '24px 16px',
              background: 'var(--color-surface)',
              item: {
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                states: {
                  default: { color: 'var(--color-text)' },
                  hover: { background: '#fff', color: 'var(--color-primary)' },
                  active: { background: 'var(--color-primary)', color: '#fff', fontWeight: 600 }
                }
              }
            }
          }
        ]
      });
    }

    // Modal/Dialog components
    if (!componentTypes || componentTypes.includes('modals')) {
      components.push({
        category: 'modals',
        variants: [
          {
            id: 'modal_centered',
            name: 'Centered Modal',
            styles: {
              overlay: {
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000
              },
              content: {
                position: 'relative',
                maxWidth: '600px',
                margin: '5% auto',
                padding: '32px',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'slideIn 0.3s ease-out'
              }
            },
            accessibility: {
              role: 'dialog',
              ariaModal: true,
              focusTrap: true,
              escapeToClose: true
            }
          }
        ]
      });
    }

    return {
      agentName: this.name,
      components,
      metadata: {
        interactionStyle,
        accessibility: accessibility || 'WCAG 2.1 AA',
        generatedAt: new Date().toISOString(),
        confidence: 0.91
      }
    };
  }
}

export const componentAgent = new ComponentAgent();
