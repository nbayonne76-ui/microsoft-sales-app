/**
 * Color Agent - Specialized agent for generating color schemes
 * Part of the Multi-Agent UI Designer System
 */

export class ColorAgent {
  constructor() {
    this.name = 'ColorAgent';
    this.specialization = 'color_schemes';
  }

  /**
   * Generate multiple color scheme options based on brand context
   */
  async generateColorSchemes({ brandContext, targetAudience, industry, mood }) {
    console.log(`🎨 [ColorAgent] Generating color schemes for ${industry} industry...`);

    const schemes = [];

    // Industry-based color psychology
    const industryPalettes = {
      technology: ['#0066CC', '#00A3E0', '#7C3AED', '#10B981'],
      healthcare: ['#0EA5E9', '#10B981', '#06B6D4', '#34D399'],
      finance: ['#1E40AF', '#059669', '#0891B2', '#047857'],
      retail: ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'],
      education: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
      default: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B']
    };

    const basePalette = industryPalettes[industry] || industryPalettes.default;

    // Mood-based variations
    const moodModifiers = {
      professional: { saturation: -10, brightness: -5 },
      friendly: { saturation: 10, brightness: 5 },
      luxurious: { saturation: -15, brightness: -10 },
      energetic: { saturation: 20, brightness: 10 },
      calm: { saturation: -20, brightness: 0 }
    };

    const modifier = moodModifiers[mood] || moodModifiers.professional;

    // Generate 3 distinct color schemes
    schemes.push({
      id: 'scheme_1',
      name: 'Primary Bold',
      description: 'Bold, high-contrast scheme with strong brand presence',
      colors: {
        primary: basePalette[0],
        secondary: basePalette[1],
        accent: basePalette[2],
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280'
      },
      usage: {
        primary: 'CTAs, key actions, brand elements',
        secondary: 'Secondary buttons, links, highlights',
        accent: 'Alerts, notifications, special features'
      }
    });

    schemes.push({
      id: 'scheme_2',
      name: 'Subtle Gradient',
      description: 'Soft gradient approach with modern appeal',
      colors: {
        primary: basePalette[1],
        secondary: basePalette[3],
        accent: basePalette[2],
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: '#1F2937',
        textSecondary: '#6B7280'
      },
      gradient: `linear-gradient(135deg, ${basePalette[1]} 0%, ${basePalette[3]} 100%)`,
      usage: {
        primary: 'Headers, hero sections with gradient',
        secondary: 'Cards, sections with subtle color',
        accent: 'Interactive elements, focus states'
      }
    });

    schemes.push({
      id: 'scheme_3',
      name: 'Dark Mode Optimized',
      description: 'Elegant dark mode with reduced eye strain',
      colors: {
        primary: this.lightenColor(basePalette[0], 20),
        secondary: this.lightenColor(basePalette[1], 15),
        accent: this.lightenColor(basePalette[2], 25),
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8'
      },
      usage: {
        primary: 'Dark theme CTAs, navigation',
        secondary: 'Dark theme sections, cards',
        accent: 'Dark theme highlights, badges'
      }
    });

    return {
      agentName: this.name,
      schemes,
      metadata: {
        industry,
        mood,
        targetAudience,
        generatedAt: new Date().toISOString(),
        confidence: 0.92
      }
    };
  }

  /**
   * Utility: Lighten a hex color by percentage
   */
  lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1).toUpperCase();
  }
}

export const colorAgent = new ColorAgent();
