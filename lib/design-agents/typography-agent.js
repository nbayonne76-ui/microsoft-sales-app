/**
 * Typography Agent - Specialized agent for generating typography systems
 * Part of the Multi-Agent UI Designer System
 */

export class TypographyAgent {
  constructor() {
    this.name = 'TypographyAgent';
    this.specialization = 'typography_systems';
  }

  /**
   * Generate multiple typography system options
   */
  async generateTypographySystems({ brandPersonality, readability, targetAudience }) {
    console.log(`✍️ [TypographyAgent] Generating typography systems for ${brandPersonality} personality...`);

    const systems = [];

    // Font pairings based on personality
    const fontPairings = {
      modern: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Roboto, sans-serif',
        accent: 'Space Grotesk, monospace'
      },
      elegant: {
        primary: 'Playfair Display, serif',
        secondary: 'Source Sans Pro, sans-serif',
        accent: 'Cormorant Garamond, serif'
      },
      playful: {
        primary: 'Poppins, sans-serif',
        secondary: 'Nunito, sans-serif',
        accent: 'Fredoka, sans-serif'
      },
      professional: {
        primary: 'IBM Plex Sans, sans-serif',
        secondary: 'Open Sans, sans-serif',
        accent: 'IBM Plex Mono, monospace'
      },
      tech: {
        primary: 'JetBrains Mono, monospace',
        secondary: 'Inter, sans-serif',
        accent: 'Fira Code, monospace'
      }
    };

    const baseFonts = fontPairings[brandPersonality] || fontPairings.modern;

    // Readability-based scale adjustments
    const scaleMultipliers = {
      high: 1.2,      // Larger, more readable
      medium: 1.0,    // Standard
      comfortable: 1.1 // Slightly larger
    };

    const multiplier = scaleMultipliers[readability] || 1.0;

    // System 1: Modern Scale (1.25 ratio)
    systems.push({
      id: 'typo_1',
      name: 'Modern Scale',
      description: 'Perfect fourth scale with modern proportions',
      fonts: baseFonts,
      scale: {
        h1: `${48 * multiplier}px`,
        h2: `${38 * multiplier}px`,
        h3: `${30 * multiplier}px`,
        h4: `${24 * multiplier}px`,
        h5: `${20 * multiplier}px`,
        h6: `${16 * multiplier}px`,
        body: `${16 * multiplier}px`,
        small: `${14 * multiplier}px`,
        caption: `${12 * multiplier}px`
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2.0
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.05em'
      }
    });

    // System 2: Classic Scale (1.333 ratio - perfect fourth)
    systems.push({
      id: 'typo_2',
      name: 'Classic Harmony',
      description: 'Classic typographic scale with excellent hierarchy',
      fonts: baseFonts,
      scale: {
        h1: `${56 * multiplier}px`,
        h2: `${42 * multiplier}px`,
        h3: `${32 * multiplier}px`,
        h4: `${24 * multiplier}px`,
        h5: `${18 * multiplier}px`,
        h6: `${16 * multiplier}px`,
        body: `${16 * multiplier}px`,
        small: `${14 * multiplier}px`,
        caption: `${12 * multiplier}px`
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.6,
        relaxed: 1.8,
        loose: 2.0
      },
      letterSpacing: {
        tight: '-0.01em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em'
      }
    });

    // System 3: Compact Scale (optimized for data density)
    systems.push({
      id: 'typo_3',
      name: 'Compact Efficient',
      description: 'Space-efficient scale for information-dense interfaces',
      fonts: baseFonts,
      scale: {
        h1: `${40 * multiplier}px`,
        h2: `${32 * multiplier}px`,
        h3: `${26 * multiplier}px`,
        h4: `${22 * multiplier}px`,
        h5: `${18 * multiplier}px`,
        h6: `${16 * multiplier}px`,
        body: `${15 * multiplier}px`,
        small: `${13 * multiplier}px`,
        caption: `${11 * multiplier}px`
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.45,
        relaxed: 1.6,
        loose: 1.8
      },
      letterSpacing: {
        tight: '-0.015em',
        normal: '0',
        wide: '0.015em',
        wider: '0.03em'
      }
    });

    return {
      agentName: this.name,
      systems,
      metadata: {
        brandPersonality,
        readability,
        targetAudience,
        generatedAt: new Date().toISOString(),
        confidence: 0.90
      }
    };
  }
}

export const typographyAgent = new TypographyAgent();
