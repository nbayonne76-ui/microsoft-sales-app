import { NextResponse } from 'next/server';

// Partner data based on your provided information
const PARTNER_DATA = [
  { sourceId: "48331812", partnerName: "US Robotis Distribution", partnerOneId: "48331812", partnerOneName: "US Robotis Distribution" },
  { sourceId: "46593522", partnerName: "intY Test Reseller 5", partnerOneId: "46593522", partnerOneName: "intY Test Reseller 5" },
  { sourceId: "6894122", partnerName: "ORFIS", partnerOneId: "6894122", partnerOneName: "ORFIS" },
  { sourceId: "6894123", partnerName: "ORFIS", partnerOneId: "6894122", partnerOneName: "ORFIS" },
  { sourceId: "6894114", partnerName: "3 P I", partnerOneId: "6894114", partnerOneName: "3 P I" },
  { sourceId: "6894115", partnerName: "3 P I", partnerOneId: "6894114", partnerOneName: "3 P I" },
  { sourceId: "6894084", partnerName: "ILLUIN TECHNOLOGY", partnerOneId: "6894084", partnerOneName: "ILLUIN TECHNOLOGY" },
  { sourceId: "6894085", partnerName: "ILLUIN TECHNOLOGY", partnerOneId: "6894084", partnerOneName: "ILLUIN TECHNOLOGY" },
  { sourceId: "6894047", partnerName: "OUVANET", partnerOneId: "6894047", partnerOneName: "OUVANET" },
  { sourceId: "6894048", partnerName: "OUVANET", partnerOneId: "6894047", partnerOneName: "OUVANET" },
  { sourceId: "6894029", partnerName: "BIONDOTECH", partnerOneId: "6894029", partnerOneName: "BIONDOTECH" },
  { sourceId: "6894030", partnerName: "BIONDOTECH", partnerOneId: "6894029", partnerOneName: "BIONDOTECH" },
  { sourceId: "6893904", partnerName: "PulsivIT", partnerOneId: "6893904", partnerOneName: "PulsivIT" },
  { sourceId: "6893905", partnerName: "PulsivIT", partnerOneId: "6893904", partnerOneName: "PulsivIT" },
  { sourceId: "6893814", partnerName: "Le Cab IT", partnerOneId: "6893814", partnerOneName: "Le Cab IT" },
  { sourceId: "6893815", partnerName: "Le Cab IT", partnerOneId: "6893814", partnerOneName: "Le Cab IT" },
  { sourceId: "6893753", partnerName: "OSMIOS", partnerOneId: "6893753", partnerOneName: "OSMIOS" },
  { sourceId: "6893754", partnerName: "OSMIOS", partnerOneId: "6893753", partnerOneName: "OSMIOS" },
  { sourceId: "ac704208-adb4-4e0b-b059-de251861c135", partnerName: "OSMIOS", partnerOneId: "6893753", partnerOneName: "OSMIOS" },
  { sourceId: "c3f512d7-1668-4b7d-ad39-6635fd14afde", partnerName: "OSMIOS", partnerOneId: "6893753", partnerOneName: "OSMIOS" },
  { sourceId: "df16a5b8-7edd-43db-bf85-3ffbb9722f87", partnerName: "OSMIOS", partnerOneId: "6893753", partnerOneName: "OSMIOS" },
  { sourceId: "24095f8d-08ef-4223-9d13-69293cddbe1d", partnerName: "INOV-IT PRO", partnerOneId: "6893741", partnerOneName: "INOV-IT PRO" },
  { sourceId: "3b987e6b-131d-43b3-99c7-216ada7e5af9", partnerName: "INOV-IT PRO", partnerOneId: "6893741", partnerOneName: "INOV-IT PRO" },
  { sourceId: "6893741", partnerName: "INOV-IT PRO", partnerOneId: "6893741", partnerOneName: "INOV-IT PRO" },
  { sourceId: "6893742", partnerName: "INOV-IT PRO", partnerOneId: "6893741", partnerOneName: "INOV-IT PRO" },
  { sourceId: "e3ac51d9-44d7-445d-9d8e-646957971b0f", partnerName: "INOV-IT PRO", partnerOneId: "6893741", partnerOneName: "INOV-IT PRO" },
  { sourceId: "1f767144-ace3-445c-935b-0ba4a50c0498", partnerName: "ALLIANCE SI", partnerOneId: "6893675", partnerOneName: "ALLIANCE SI" },
  { sourceId: "6893675", partnerName: "ALLIANCE SI", partnerOneId: "6893675", partnerOneName: "ALLIANCE SI" },
  { sourceId: "6893676", partnerName: "ALLIANCE SI", partnerOneId: "6893675", partnerOneName: "ALLIANCE SI" },
  { sourceId: "c17bdbbd-b87c-42cb-99ca-95f9dea8d92a", partnerName: "ALLIANCE SI", partnerOneId: "6893675", partnerOneName: "ALLIANCE SI" },
  { sourceId: "6893632", partnerName: "ALVES Nans", partnerOneId: "6893632", partnerOneName: "ALVES Nans" },
  { sourceId: "6893633", partnerName: "ALVES Nans", partnerOneId: "6893632", partnerOneName: "ALVES Nans" },
  { sourceId: "76ae0b2e-dafc-4f5c-807f-673516fa7a49", partnerName: "ALVES Nans", partnerOneId: "6893632", partnerOneName: "ALVES Nans" },
  { sourceId: "f5206357-6202-4640-ab9e-24fef3edfdab", partnerName: "ALVES Nans", partnerOneId: "6893632", partnerOneName: "ALVES Nans" },
  { sourceId: "6893602", partnerName: "Tybot.fr", partnerOneId: "6893602", partnerOneName: "Tybot.fr" },
  { sourceId: "6893603", partnerName: "Tybot.fr", partnerOneId: "6893602", partnerOneName: "Tybot.fr" },
  { sourceId: "9451c098-8ada-417a-beba-8b403a4528ea", partnerName: "Tybot.fr", partnerOneId: "6893602", partnerOneName: "Tybot.fr" },
  { sourceId: "ef7775f6-fab1-45f7-a5e7-03d46adb3b46", partnerName: "Tybot.fr", partnerOneId: "6893602", partnerOneName: "Tybot.fr" },
  { sourceId: "6893557", partnerName: "Thomas", partnerOneId: "6893557", partnerOneName: "Thomas" },
  { sourceId: "6893558", partnerName: "Thomas", partnerOneId: "6893557", partnerOneName: "Thomas" },
  { sourceId: "b5ca766b-e7ee-4614-af6d-81374508bc79", partnerName: "Thomas", partnerOneId: "6893557", partnerOneName: "Thomas" },
  { sourceId: "ec8aef85-7c75-4053-9331-732b056563c5", partnerName: "Thomas", partnerOneId: "6893557", partnerOneName: "Thomas" }
  // Note: This is a sample subset. In production, you'd load all 1000+ partners from your database
];

// Create a lookup index for faster searching
const createPartnerIndex = () => {
  const index = new Map();
  
  PARTNER_DATA.forEach(partner => {
    // Index by source ID
    index.set(partner.sourceId.toLowerCase(), partner);
    // Index by partner one ID for canonical lookup
    index.set(partner.partnerOneId.toLowerCase(), partner);
    // Index by partner name (fuzzy matching)
    index.set(partner.partnerName.toLowerCase(), partner);
    index.set(partner.partnerOneName.toLowerCase(), partner);
  });
  
  return index;
};

const partnerIndex = createPartnerIndex();

// Partner lookup function
const findPartner = (searchTerm) => {
  if (!searchTerm) return null;
  
  const term = searchTerm.toLowerCase().trim();
  
  // Direct ID lookup
  let partner = partnerIndex.get(term);
  if (partner) return partner;
  
  // Fuzzy name search
  for (const [key, partnerData] of partnerIndex.entries()) {
    if (key.includes(term) || term.includes(key)) {
      return partnerData;
    }
  }
  
  return null;
};

// API Routes
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  
  try {
    if (id || search) {
      // Search for specific partner
      const partner = findPartner(id || search);
      
      if (partner) {
        return NextResponse.json({
          success: true,
          partner: {
            sourceId: partner.sourceId,
            partnerName: partner.partnerName,
            partnerOneId: partner.partnerOneId,
            partnerOneName: partner.partnerOneName,
            // Add derived fields for better UX
            displayName: partner.partnerOneName,
            canonicalId: partner.partnerOneId,
            aliases: PARTNER_DATA
              .filter(p => p.partnerOneId === partner.partnerOneId)
              .map(p => p.sourceId)
              .filter((id, index, arr) => arr.indexOf(id) === index) // Remove duplicates
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `Partner not found for: ${id || search}`,
          suggestions: PARTNER_DATA
            .filter(p => p.partnerName.toLowerCase().includes((id || search).toLowerCase()))
            .slice(0, 5)
            .map(p => ({ id: p.partnerOneId, name: p.partnerOneName }))
        });
      }
    } else {
      // Return partner statistics
      const uniquePartners = new Set(PARTNER_DATA.map(p => p.partnerOneId)).size;
      const totalEntries = PARTNER_DATA.length;
      
      return NextResponse.json({
        success: true,
        stats: {
          totalPartners: uniquePartners,
          totalEntries: totalEntries,
          samplePartners: PARTNER_DATA.slice(0, 10).map(p => ({
            id: p.partnerOneId,
            name: p.partnerOneName
          }))
        }
      });
    }
  } catch (error) {
    console.error('Partner API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { partnerId } = await request.json();
    
    const partner = findPartner(partnerId);
    
    if (partner) {
      return NextResponse.json({
        success: true,
        partner: {
          sourceId: partner.sourceId,
          partnerName: partner.partnerName,
          partnerOneId: partner.partnerOneId,
          partnerOneName: partner.partnerOneName,
          displayName: partner.partnerOneName,
          canonicalId: partner.partnerOneId
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Partner not found for ID: ${partnerId}`
      });
    }
  } catch (error) {
    console.error('Partner POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}