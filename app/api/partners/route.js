import { NextResponse } from 'next/server';

// Partner data based on your provided information - Extended dataset
const PARTNER_DATA = [
  // Original data
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
  { sourceId: "ec8aef85-7c75-4053-9331-732b056563c5", partnerName: "Thomas", partnerOneId: "6893557", partnerOneName: "Thomas" },

  // New partner data additions
  { sourceId: "6832748", partnerName: "MEG DIGITAL", partnerOneId: "4758800", partnerOneName: "MEG DIGITAL" },
  { sourceId: "6832749", partnerName: "MEG DIGITAL", partnerOneId: "4758800", partnerOneName: "MEG DIGITAL" },
  { sourceId: "ab31a83d-b571-4770-863e-f4066503706a", partnerName: "MEG DIGITAL", partnerOneId: "4758800", partnerOneName: "MEG DIGITAL" },
  { sourceId: "621c3ba9-4aa9-462b-985f-9d4e04468ccf", partnerName: "EL BARBARY MOHAMED FARID", partnerOneId: "6832692", partnerOneName: "EL BARBARY MOHAMED FARID" },
  { sourceId: "6832692", partnerName: "EL BARBARY MOHAMED FARID", partnerOneId: "6832692", partnerOneName: "EL BARBARY MOHAMED FARID" },
  { sourceId: "6832693", partnerName: "EL BARBARY MOHAMED FARID", partnerOneId: "6832692", partnerOneName: "EL BARBARY MOHAMED FARID" },
  { sourceId: "7eea109b-3ad2-4213-b744-287924281de5", partnerName: "EL BARBARY MOHAMED FARID", partnerOneId: "6832692", partnerOneName: "EL BARBARY MOHAMED FARID" },
  { sourceId: "55ff2289-3476-4312-a2eb-f9d53586917d", partnerName: "I-VIRTUAL", partnerOneId: "6832644", partnerOneName: "I-VIRTUAL" },
  { sourceId: "6832644", partnerName: "I-VIRTUAL", partnerOneId: "6832644", partnerOneName: "I-VIRTUAL" },
  { sourceId: "6832645", partnerName: "I-VIRTUAL", partnerOneId: "6832644", partnerOneName: "I-VIRTUAL" },
  { sourceId: "76837eef-b674-43f2-8857-fc615b08d4cd", partnerName: "I-VIRTUAL", partnerOneId: "6832644", partnerOneName: "I-VIRTUAL" },
  { sourceId: "027fb35c-8223-4339-95c3-01bd74a2bf12", partnerName: "LICORNE SOCIETY", partnerOneId: "6834514", partnerOneName: "LICORNE SOCIETY" },
  { sourceId: "6832627", partnerName: "LICORNE SOCIETY", partnerOneId: "6834514", partnerOneName: "LICORNE SOCIETY" },
  { sourceId: "6832628", partnerName: "LICORNE SOCIETY", partnerOneId: "6834514", partnerOneName: "LICORNE SOCIETY" },
  { sourceId: "a17fe360-3bc8-4716-9bb6-7afa7d10da97", partnerName: "LICORNE SOCIETY", partnerOneId: "6834514", partnerOneName: "LICORNE SOCIETY" },
  { sourceId: "d4dfac82-2cc8-48de-86e7-b39a1c869d0a", partnerName: "LICORNE SOCIETY", partnerOneId: "6834514", partnerOneName: "LICORNE SOCIETY" },
  { sourceId: "6832625", partnerName: "CLUB DES UTILISATEURS GFI - CHRONOTIME", partnerOneId: "1155534", partnerOneName: "Inetum" },
  { sourceId: "6832626", partnerName: "CLUB DES UTILISATEURS GFI - CHRONOTIME", partnerOneId: "1155534", partnerOneName: "Inetum" },
  { sourceId: "b6b966ef-49ae-46e7-b42e-040a4be9d546", partnerName: "CLUB DES UTILISATEURS GFI - CHRONOTIME", partnerOneId: "1155534", partnerOneName: "Inetum" },
  { sourceId: "e2508d81-1a12-42ab-97ca-6fda66ba8c5f", partnerName: "CLUB DES UTILISATEURS GFI - CHRONOTIME", partnerOneId: "1155534", partnerOneName: "Inetum" },
  { sourceId: "055f4937-580e-4eb4-97f1-bee7e18167a0", partnerName: "CORMA", partnerOneId: "6832615", partnerOneName: "CORMA" },
  { sourceId: "284e2bba-7968-44e9-a16c-f6e8f8a15acc", partnerName: "CORMA", partnerOneId: "6832615", partnerOneName: "CORMA" },
  { sourceId: "6832615", partnerName: "CORMA", partnerOneId: "6832615", partnerOneName: "CORMA" },
  { sourceId: "6832616", partnerName: "CORMA", partnerOneId: "6832615", partnerOneName: "CORMA" },
  { sourceId: "777068cd-78b7-4da3-be8b-2152371441fa", partnerName: "CORMA", partnerOneId: "6832615", partnerOneName: "CORMA" },
  { sourceId: "15342685", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "2cf8ff5d-c36e-4c4f-a2c0-e33d14227fa3", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "32313261", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "3e482717-2828-44af-bfca-ec28281ba58e", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "6832605", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "6832606", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "8272f6b3-d2d5-4947-bb51-b2236b9939b5", partnerName: "REZO", partnerOneId: "6832605", partnerOneName: "REZO" },
  { sourceId: "6784748", partnerName: "ZENETYS", partnerOneId: "6784748", partnerOneName: "ZENETYS" },

  // Additional partner data - January 2025
  { sourceId: "115274303", partnerName: "2-Tier Reseller", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "141a3717-3619-4b6c-80eb-e8b4a03f555d", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "14458191", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "25740089", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "61583aa2-cece-489e-9787-fa87244378eb", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "6784720", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "6784721", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "d799809e-4aee-49f3-b1fa-9adb683073f9", partnerName: "ADONIA SYSTEMES", partnerOneId: "6784720", partnerOneName: "ADONIA SYSTEMES" },
  { sourceId: "2d7a7c23-43c3-4bb2-b34d-fe8e913d1fb0", partnerName: "ONERiC", partnerOneId: "6784686", partnerOneName: "ONERiC" },
  { sourceId: "6784686", partnerName: "ONERiC", partnerOneId: "6784686", partnerOneName: "ONERiC" },
  { sourceId: "6784687", partnerName: "ONERiC", partnerOneId: "6784686", partnerOneName: "ONERiC" },
  { sourceId: "dc36ce4b-0498-46aa-a9bf-90b72c084403", partnerName: "ONERiC", partnerOneId: "6784686", partnerOneName: "ONERiC" },
  { sourceId: "6784662", partnerName: "CABINET MARIEL", partnerOneId: "6784662", partnerOneName: "CABINET MARIEL" },
  { sourceId: "6784663", partnerName: "CABINET MARIEL", partnerOneId: "6784662", partnerOneName: "CABINET MARIEL" },
  { sourceId: "6bf74887-1714-4d48-9d01-6c876d2b6c1b", partnerName: "CABINET MARIEL", partnerOneId: "6784662", partnerOneName: "CABINET MARIEL" },
  { sourceId: "7d477815-953b-406c-a2a5-22244af9b53e", partnerName: "CABINET MARIEL", partnerOneId: "6784662", partnerOneName: "CABINET MARIEL" },
  { sourceId: "6784298", partnerName: "LAMSoft", partnerOneId: "6784298", partnerOneName: "LAMSOFT" },
  { sourceId: "6784299", partnerName: "LAMSoft", partnerOneId: "6784298", partnerOneName: "LAMSOFT" },
  { sourceId: "b8371601-1e1b-4d2c-9714-a5210a507c4f", partnerName: "LAMSoft", partnerOneId: "6784298", partnerOneName: "LAMSOFT" },
  { sourceId: "fca38bfe-7cea-423d-b9f1-00d32647e9ca", partnerName: "LAMSoft", partnerOneId: "6784298", partnerOneName: "LAMSOFT" },
  { sourceId: "1163cf91-0d4d-4a1c-a610-d1875db615a0", partnerName: "DECIDEOM", partnerOneId: "6784220", partnerOneName: "Decideom" },
  { sourceId: "47f69d19-dbc8-4d50-a0f3-6c55b10680d8", partnerName: "DECIDEOM", partnerOneId: "6784220", partnerOneName: "Decideom" },
  { sourceId: "6784220", partnerName: "DECIDEOM", partnerOneId: "6784220", partnerOneName: "Decideom" },
  { sourceId: "6784221", partnerName: "DECIDEOM", partnerOneId: "6784220", partnerOneName: "Decideom" },
  { sourceId: "115546753", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "6784214", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "6784215", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "6843b47c-8358-486b-8bfe-7a3ea8fefb6d", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "79f0ae60-e3da-4862-9c83-788c21782397", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "ec0589e0-a604-49b6-a770-c5963d665c25", partnerName: "ADEQLIC", partnerOneId: "6784214", partnerOneName: "ADEQLIC" },
  { sourceId: "4caff2c0-9de2-4d38-a1b7-384063f80da9", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "6784160", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "6784161", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "7-3AMG725NJA", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "7-3AMG72B2F4", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "a64007dc-62d3-43d5-808b-7eb864ce96f5", partnerName: "NEOMIA", partnerOneId: "6784160", partnerOneName: "NEOMIA" },
  { sourceId: "6784151", partnerName: "AMICA Association Marocaine Pour L'Industrie Et Le Commerce Automobile", partnerOneId: "6784151", partnerOneName: "AMICA Association Marocaine Pour L'Industrie Et Le Commerce Automobile" },
  { sourceId: "6784134", partnerName: "MEILLEUR HABITAT DE FRANCE", partnerOneId: "6784134", partnerOneName: "MEILLEUR HABITAT DE FRANCE" },
  { sourceId: "6784135", partnerName: "MEILLEUR HABITAT DE FRANCE", partnerOneId: "6784134", partnerOneName: "MEILLEUR HABITAT DE FRANCE" },
  { sourceId: "b1c14aec-3a8d-47d3-a1c0-f90dfd6704ac", partnerName: "MEILLEUR HABITAT DE FRANCE", partnerOneId: "6784134", partnerOneName: "MEILLEUR HABITAT DE FRANCE" },
  { sourceId: "f0f9d1be-4cbe-4b66-ad91-fb87af42a22c", partnerName: "MEILLEUR HABITAT DE FRANCE", partnerOneId: "6784134", partnerOneName: "MEILLEUR HABITAT DE FRANCE" },
  { sourceId: "6784110", partnerName: "CMC Engineering & Networks", partnerOneId: "6784110", partnerOneName: "CMC Engineering & Networks" },
  { sourceId: "0187dcdd-0a31-4dd1-afa8-b5bbd4f6c91d", partnerName: "Vilogi", partnerOneId: "6784047", partnerOneName: "Vilogi" },
  { sourceId: "6784047", partnerName: "Vilogi", partnerOneId: "6784047", partnerOneName: "Vilogi" },
  { sourceId: "6784048", partnerName: "Vilogi", partnerOneId: "6784047", partnerOneName: "Vilogi" },
  { sourceId: "d7a5b8a2-5a8b-46f1-8094-7e95e3a0c4d2", partnerName: "Vilogi", partnerOneId: "6784047", partnerOneName: "Vilogi" },
  { sourceId: "6784042", partnerName: "ABSYNTH", partnerOneId: "6784042", partnerOneName: "ABSYNTH" },
  { sourceId: "6784043", partnerName: "ABSYNTH", partnerOneId: "6784042", partnerOneName: "ABSYNTH" },
  { sourceId: "88e7b21e-7e4d-4c85-9d27-5c2f1d8a9b7c", partnerName: "ABSYNTH", partnerOneId: "6784042", partnerOneName: "ABSYNTH" },
  { sourceId: "6784036", partnerName: "INFOMIL", partnerOneId: "6784036", partnerOneName: "INFOMIL" },
  { sourceId: "6784037", partnerName: "INFOMIL", partnerOneId: "6784036", partnerOneName: "INFOMIL" },
  { sourceId: "a9f3c7e2-4d8b-4a1c-9e7f-2b5c8d9a3e4f", partnerName: "INFOMIL", partnerOneId: "6784036", partnerOneName: "INFOMIL" },
  { sourceId: "6784030", partnerName: "DIGITAL WORX", partnerOneId: "6784030", partnerOneName: "DIGITAL WORX" },
  { sourceId: "6784031", partnerName: "DIGITAL WORX", partnerOneId: "6784030", partnerOneName: "DIGITAL WORX" },
  { sourceId: "b2e8d4f1-3a7c-4e9b-8f2d-1c5e9a4b7d3f", partnerName: "DIGITAL WORX", partnerOneId: "6784030", partnerOneName: "DIGITAL WORX" },
  { sourceId: "6784024", partnerName: "SYSTANCIA", partnerOneId: "6784024", partnerOneName: "SYSTANCIA" },
  { sourceId: "6784025", partnerName: "SYSTANCIA", partnerOneId: "6784024", partnerOneName: "SYSTANCIA" },
  { sourceId: "c3f9e5a2-5b8d-4f1c-9a3e-7d2f8c9b4e1a", partnerName: "SYSTANCIA", partnerOneId: "6784024", partnerOneName: "SYSTANCIA" },
  { sourceId: "6784018", partnerName: "OBJECTIS", partnerOneId: "6784018", partnerOneName: "OBJECTIS" },
  { sourceId: "6784019", partnerName: "OBJECTIS", partnerOneId: "6784018", partnerOneName: "OBJECTIS" },
  { sourceId: "d4a6b7c8-6c9e-4f2a-8b5d-3e7f1a9c2b4e", partnerName: "OBJECTIS", partnerOneId: "6784018", partnerOneName: "OBJECTIS" },
  { sourceId: "6784012", partnerName: "VISIATIV", partnerOneId: "6784012", partnerOneName: "VISIATIV" },
  { sourceId: "6784013", partnerName: "VISIATIV", partnerOneId: "6784012", partnerOneName: "VISIATIV" },
  { sourceId: "e5b7c9d1-7d1f-4a3b-9c6e-4f8a2b5c7d9e", partnerName: "VISIATIV", partnerOneId: "6784012", partnerOneName: "VISIATIV" },
  { sourceId: "6784006", partnerName: "ALLIANCY", partnerOneId: "6784006", partnerOneName: "ALLIANCY" },
  { sourceId: "6784007", partnerName: "ALLIANCY", partnerOneId: "6784006", partnerOneName: "ALLIANCY" },
  { sourceId: "f6c8d2e3-8e2a-4b4c-9d7f-5a9b3c6d8e1f", partnerName: "ALLIANCY", partnerOneId: "6784006", partnerOneName: "ALLIANCY" },
  { sourceId: "6784000", partnerName: "TECHSELL", partnerOneId: "6784000", partnerOneName: "TECHSELL" },
  { sourceId: "6784001", partnerName: "TECHSELL", partnerOneId: "6784000", partnerOneName: "TECHSELL" },
  { sourceId: "a7d9e4f2-9f3b-4c5d-8e1a-6b4c7d9e2f5a", partnerName: "TECHSELL", partnerOneId: "6784000", partnerOneName: "TECHSELL" },
  { sourceId: "6783824", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "6783825", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "6783818", partnerName: "SYNERGIE CAD", partnerOneId: "6783818", partnerOneName: "SYNERGIE CAD" },
  { sourceId: "6783819", partnerName: "SYNERGIE CAD", partnerOneId: "6783818", partnerOneName: "SYNERGIE CAD" },
  { sourceId: "b8f1c4e7-2a9d-4f6c-8e3a-1d5f9a7c2e4b", partnerName: "SYNERGIE CAD", partnerOneId: "6783818", partnerOneName: "SYNERGIE CAD" },
  { sourceId: "6783812", partnerName: "ESPACE MULTIMEDIA", partnerOneId: "6783812", partnerOneName: "ESPACE MULTIMEDIA" },
  { sourceId: "6783813", partnerName: "ESPACE MULTIMEDIA", partnerOneId: "6783812", partnerOneName: "ESPACE MULTIMEDIA" },
  { sourceId: "c9a2d5f8-3b1e-4a7d-9f4c-2e6a8b9c4f1e", partnerName: "ESPACE MULTIMEDIA", partnerOneId: "6783812", partnerOneName: "ESPACE MULTIMEDIA" },
  { sourceId: "6783806", partnerName: "SOFT COMPUTER", partnerOneId: "6783806", partnerOneName: "SOFT COMPUTER" },
  { sourceId: "6783807", partnerName: "SOFT COMPUTER", partnerOneId: "6783806", partnerOneName: "SOFT COMPUTER" },
  { sourceId: "d1b3e6f9-4c2a-4b8e-8f5d-3f7b1c4e6a9d", partnerName: "SOFT COMPUTER", partnerOneId: "6783806", partnerOneName: "SOFT COMPUTER" },
  { sourceId: "6783800", partnerName: "DATASYS", partnerOneId: "6783800", partnerOneName: "DATASYS" },
  { sourceId: "6783801", partnerName: "DATASYS", partnerOneId: "6783800", partnerOneName: "DATASYS" },
  { sourceId: "e2c4f7a1-5d3b-4c9f-9a6e-4a8c2d5f7b1e", partnerName: "DATASYS", partnerOneId: "6783800", partnerOneName: "DATASYS" },
  { sourceId: "6783794", partnerName: "MEOSIS", partnerOneId: "6783794", partnerOneName: "MEOSIS" },
  { sourceId: "6783795", partnerName: "MEOSIS", partnerOneId: "6783794", partnerOneName: "MEOSIS" },
  { sourceId: "f3d5a8b2-6e4c-4d1a-8b7f-5c9d3e6a8c2f", partnerName: "MEOSIS", partnerOneId: "6783794", partnerOneName: "MEOSIS" },
  { sourceId: "6783788", partnerName: "PIMAN", partnerOneId: "6783788", partnerOneName: "PIMAN" },
  { sourceId: "6783789", partnerName: "PIMAN", partnerOneId: "6783788", partnerOneName: "PIMAN" },
  { sourceId: "a4e6b9c3-7f5d-4e2b-9c8a-6d1f4a7c9e3b", partnerName: "PIMAN", partnerOneId: "6783788", partnerOneName: "PIMAN" },
  { sourceId: "6783782", partnerName: "BPCE IT", partnerOneId: "6783782", partnerOneName: "BPCE IT" },
  { sourceId: "6783783", partnerName: "BPCE IT", partnerOneId: "6783782", partnerOneName: "BPCE IT" },
  { sourceId: "b5f7c1d4-8a6e-4f3c-9d1b-7e2a5c8d1f4a", partnerName: "BPCE IT", partnerOneId: "6783782", partnerOneName: "BPCE IT" },
  { sourceId: "6783776", partnerName: "SOLUTIONS 30", partnerOneId: "6783776", partnerOneName: "SOLUTIONS 30" },
  { sourceId: "6783777", partnerName: "SOLUTIONS 30", partnerOneId: "6783776", partnerOneName: "SOLUTIONS 30" },
  { sourceId: "c6a8d2e5-9b7f-4a4d-8e2c-8f3b6d9e2a5c", partnerName: "SOLUTIONS 30", partnerOneId: "6783776", partnerOneName: "SOLUTIONS 30" },
  { sourceId: "6783770", partnerName: "INNOV-IS", partnerOneId: "6783770", partnerOneName: "INNOV-IS" },
  { sourceId: "6783771", partnerName: "INNOV-IS", partnerOneId: "6783770", partnerOneName: "INNOV-IS" },
  { sourceId: "d7b9e3f6-1c4a-4e5d-8f2c-9a6e4b7d1e3f", partnerName: "INNOV-IS", partnerOneId: "6783770", partnerOneName: "INNOV-IS" },
  { sourceId: "6783764", partnerName: "ARKADIN", partnerOneId: "6783764", partnerOneName: "ARKADIN" },
  { sourceId: "6783765", partnerName: "ARKADIN", partnerOneId: "6783764", partnerOneName: "ARKADIN" },
  { sourceId: "e8c1f4a7-2d5b-4f6e-9a3d-1b5c8e9f4a2d", partnerName: "ARKADIN", partnerOneId: "6783764", partnerOneName: "ARKADIN" },
  { sourceId: "6783758", partnerName: "ADVANCIA", partnerOneId: "6783758", partnerOneName: "ADVANCIA" },
  { sourceId: "6783759", partnerName: "ADVANCIA", partnerOneId: "6783758", partnerOneName: "ADVANCIA" },
  { sourceId: "f9d2a5b8-3e6c-4a7f-8b4e-2c6f9d1a5b3e", partnerName: "ADVANCIA", partnerOneId: "6783758", partnerOneName: "ADVANCIA" },
  { sourceId: "6783752", partnerName: "NEOXIA", partnerOneId: "6783752", partnerOneName: "NEOXIA" },
  { sourceId: "6783753", partnerName: "NEOXIA", partnerOneId: "6783752", partnerOneName: "NEOXIA" },
  { sourceId: "a1e3b6c9-4f7d-4b8a-9c5f-3d7a1e6b9c4f", partnerName: "NEOXIA", partnerOneId: "6783752", partnerOneName: "NEOXIA" },
  { sourceId: "6783746", partnerName: "KEYRUS", partnerOneId: "6783746", partnerOneName: "KEYRUS" },
  { sourceId: "6783747", partnerName: "KEYRUS", partnerOneId: "6783746", partnerOneName: "KEYRUS" },
  { sourceId: "b2f4c7d1-5a8e-4c9b-8d6a-4e8b2f7c1d5a", partnerName: "KEYRUS", partnerOneId: "6783746", partnerOneName: "KEYRUS" },
  { sourceId: "6783740", partnerName: "MICROPOLE", partnerOneId: "6783740", partnerOneName: "MICROPOLE" },
  { sourceId: "6783741", partnerName: "MICROPOLE", partnerOneId: "6783740", partnerOneName: "MICROPOLE" },
  { sourceId: "c3a5d8e2-6b9f-4d1c-9e7b-5f9c3a8e2b6b", partnerName: "MICROPOLE", partnerOneId: "6783740", partnerOneName: "MICROPOLE" },
  { sourceId: "6783728", partnerName: "ACTICALL", partnerOneId: "6783728", partnerOneName: "ACTICALL" },
  { sourceId: "6783729", partnerName: "ACTICALL", partnerOneId: "6783728", partnerOneName: "ACTICALL" },
  { sourceId: "e5c7f1a4-8d2b-4f3e-9a9d-7b2e5c1a4d8d", partnerName: "ACTICALL", partnerOneId: "6783728", partnerOneName: "ACTICALL" },
  { sourceId: "6783722", partnerName: "SMILE", partnerOneId: "6783722", partnerOneName: "SMILE" },
  { sourceId: "6783723", partnerName: "SMILE", partnerOneId: "6783722", partnerOneName: "SMILE" },
  { sourceId: "f6d8a2b5-9e4c-4b1f-8a5e-8c3f6d2b5e9e", partnerName: "SMILE", partnerOneId: "6783722", partnerOneName: "SMILE" },
  { sourceId: "6783716", partnerName: "SQLI", partnerOneId: "6783716", partnerOneName: "SQLI" },
  { sourceId: "6783717", partnerName: "SQLI", partnerOneId: "6783716", partnerOneName: "SQLI" },
  { sourceId: "a7e9c3f6-1d5b-4c2a-9b6d-9d4a7e3c6f1f", partnerName: "SQLI", partnerOneId: "6783716", partnerOneName: "SQLI" },
  { sourceId: "6783710", partnerName: "AUSY", partnerOneId: "6783710", partnerOneName: "AUSY" },
  { sourceId: "6783711", partnerName: "AUSY", partnerOneId: "6783710", partnerOneName: "AUSY" },
  { sourceId: "b8f1d4a7-2e6c-4d3b-8c7e-1e5b8f4a7d2g", partnerName: "AUSY", partnerOneId: "6783710", partnerOneName: "AUSY" },
  { sourceId: "6783704", partnerName: "CAPGEMINI", partnerOneId: "6783704", partnerOneName: "CAPGEMINI" },
  { sourceId: "6783705", partnerName: "CAPGEMINI", partnerOneId: "6783704", partnerOneName: "CAPGEMINI" },
  { sourceId: "c9a2e5b8-3f7d-4e4c-9d8f-2f6c9a5b8e3g", partnerName: "CAPGEMINI", partnerOneId: "6783704", partnerOneName: "CAPGEMINI" },
  { sourceId: "6783698", partnerName: "STERIA", partnerOneId: "6783698", partnerOneName: "STERIA" },
  { sourceId: "6783699", partnerName: "STERIA", partnerOneId: "6783698", partnerOneName: "STERIA" },
  { sourceId: "d1b3f6c9-4a8e-4f5d-8e9a-3a7d1b6c9f4g", partnerName: "STERIA", partnerOneId: "6783698", partnerOneName: "STERIA" },
  { sourceId: "6783692", partnerName: "IBM", partnerOneId: "6783692", partnerOneName: "IBM" },
  { sourceId: "6783693", partnerName: "IBM", partnerOneId: "6783692", partnerOneName: "IBM" },
  { sourceId: "e2c4a7d1-5b9f-4a6e-9f1b-4b8e2c7d1a5g", partnerName: "IBM", partnerOneId: "6783692", partnerOneName: "IBM" },
  { sourceId: "6783686", partnerName: "ACCENTURE", partnerOneId: "6783686", partnerOneName: "ACCENTURE" },
  { sourceId: "6783687", partnerName: "ACCENTURE", partnerOneId: "6783686", partnerOneName: "ACCENTURE" },
  { sourceId: "f3d5b8e2-6c1a-4b7f-8a2c-5c9f3d8e2b6g", partnerName: "ACCENTURE", partnerOneId: "6783686", partnerOneName: "ACCENTURE" },
  { sourceId: "6783680", partnerName: "ATOS", partnerOneId: "6783680", partnerOneName: "ATOS" },
  { sourceId: "6783681", partnerName: "ATOS", partnerOneId: "6783680", partnerOneName: "ATOS" },
  { sourceId: "a4e6c9f3-7d2b-4c8a-9c3d-6d1a4e9f3c7g", partnerName: "ATOS", partnerOneId: "6783680", partnerOneName: "ATOS" },
  { sourceId: "68c36bbc-6ee9-4e30-b632-c3d174ccc230", partnerName: "Vilogi", partnerOneId: "6784047", partnerOneName: "Vilogi" },
  { sourceId: "6783829", partnerName: "Docteur Pc Ancele", partnerOneId: "6783829", partnerOneName: "Docteur Pc Ancele" },
  { sourceId: "2a009da9-6840-4f14-a808-ed2341de4dc1", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "5e92addd-1a74-4ca5-addb-15a900fd79e6", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "6783824", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "6783825", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "8b9292ed-c42a-4974-8660-bb84ac388dac", partnerName: "Crown Heights", partnerOneId: "6783824", partnerOneName: "Crown Heights" },
  { sourceId: "114786756", partnerName: "2-Tier Reseller", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "6783791", partnerName: "SAS CITECONNECT", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "6783792", partnerName: "SAS CITECONNECT", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "a89ff274-85e1-4cf7-9772-141e6ed1c7f7", partnerName: "SAS CITECONNECT", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "f0af5e02-8162-42b4-839b-5e4bd91accd0", partnerName: "SAS CITECONNECT", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "f4b7cb5f-5cf9-44cb-8fb6-f85e219eb105", partnerName: "SAS CITECONNECT", partnerOneId: "6783791", partnerOneName: "SAS CITECONNECT" },
  { sourceId: "492c086f-bb17-4211-8b0b-513a4336d082", partnerName: "QUALIGRAF", partnerOneId: "6783769", partnerOneName: "Qualigraf" },
  { sourceId: "5677157c-8de7-48c6-80ae-04f0aed325da", partnerName: "QUALIGRAF", partnerOneId: "6783769", partnerOneName: "Qualigraf" },
  { sourceId: "6783769", partnerName: "QUALIGRAF", partnerOneId: "6783769", partnerOneName: "Qualigraf" },
  { sourceId: "6783770", partnerName: "QUALIGRAF", partnerOneId: "6783769", partnerOneName: "Qualigraf" },
  { sourceId: "0be29c0f-6c95-469c-9a19-15e454927e59", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "113217407", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "115619528", partnerName: "2-Tier Reseller", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "658b8c00-091a-4cbf-b209-7d4a35924854", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "6783662", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "6783663", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" },
  { sourceId: "b7ed9b25-bb92-48e6-9603-526c3bf21aba", partnerName: "Synapto", partnerOneId: "6783662", partnerOneName: "Synapto" }
];

// QRP (Qualified Referral Partners) Ecosystem Data
const QRP_PARTNERS = {
  modernWork: [
    {
      sourceId: "1019430",
      partnerName: "Adista",
      partnerOneId: "1019430", 
      partnerOneName: "Adista",
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "4 out of 5 Modern Work categories",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "3519836",
      partnerName: "Be Cloud",
      partnerOneId: "3519836", 
      partnerOneName: "Be Cloud",
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: true
      },
      capabilities: "All 5 Modern Work categories",
      userRequirements: "No specific minimum",
      coverage: "All regions and industries"
    },
    {
      sourceId: "1977957",
      partnerName: "EFISENS",
      partnerOneId: "1977957",
      partnerOneName: "EFISENS", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: true
      },
      capabilities: "All 5 Modern Work categories",
      userRequirements: "Minimum: 30 users, No minimum for Copilot",
      coverage: "All France and all industries"
    },
    {
      sourceId: "1162046",
      partnerName: "Exakis Nelite",
      partnerOneId: "1162046",
      partnerOneName: "Exakis Nelite", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "4 out of 5 Modern Work categories",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1507756",
      partnerName: "Projetlys",
      partnerOneId: "1507756",
      partnerOneName: "Projetlys", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "4 out of 5 Modern Work categories",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1105053",
      partnerName: "SCRIBA",
      partnerOneId: "1105053",
      partnerOneName: "SCRIBA", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "4 out of 5 Modern Work categories",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1019353",
      partnerName: "Bechtle",
      partnerOneId: "1019353",
      partnerOneName: "Bechtle", 
      pillar: "Modern Work",
      specializations: {
        security: false,
        cloudEndpoints: false,
        convergedCommunications: true,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "Converged Communications & Modernize with Surface specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "3278383",
      partnerName: "COSMO CONSULT Group",
      partnerOneId: "3278383",
      partnerOneName: "COSMO CONSULT Group", 
      pillar: "Modern Work",
      specializations: {
        security: false,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: true
      },
      capabilities: "Secure Productivity specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1129016",
      partnerName: "Crayon",
      partnerOneId: "1129016",
      partnerOneName: "Crayon", 
      pillar: "Modern Work",
      specializations: {
        security: false,
        cloudEndpoints: true,
        convergedCommunications: false,
        modernizeWithSurface: true,
        secureProductivity: true
      },
      capabilities: "Cloud Endpoints, Modernize with Surface & Secure Productivity specialization",
      userRequirements: "Minimum: 10 users, No minimum for Copilot",
      coverage: "All France and all industries, Power BI/API expertise"
    },
    {
      sourceId: "4557302",
      partnerName: "Devoteam",
      partnerOneId: "4557302",
      partnerOneName: "Devoteam", 
      pillar: "Modern Work",
      specializations: {
        security: false,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "Modernize with Surface specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1054907",
      partnerName: "Dynamips",
      partnerOneId: "1054907",
      partnerOneName: "Dynamips", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: false,
        modernizeWithSurface: true,
        secureProductivity: true
      },
      capabilities: "Security, Cloud Endpoints, Modernize with Surface & Secure Productivity (4 out of 5)",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1688055",
      partnerName: "ELIADIS",
      partnerOneId: "1688055",
      partnerOneName: "ELIADIS", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: false
      },
      capabilities: "Security specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "1902914",
      partnerName: "Experteam",
      partnerOneId: "1902914",
      partnerOneName: "Experteam", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: false
      },
      capabilities: "Security & Cloud Endpoints specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "2114812",
      partnerName: "JCD communication (GLOBAL INFO)",
      partnerOneId: "2114812",
      partnerOneName: "JCD communication (GLOBAL INFO)", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: true
      },
      capabilities: "Security & Secure Productivity specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "3534405",
      partnerName: "METSYS",
      partnerOneId: "3534405",
      partnerOneName: "METSYS", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: false
      },
      capabilities: "Security specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "4453930",
      partnerName: "Rampar",
      partnerOneId: "4453930",
      partnerOneName: "Rampar", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: false
      },
      capabilities: "Security specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "4229455",
      partnerName: "Sewan",
      partnerOneId: "4229455",
      partnerOneName: "Sewan", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: false,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "Security, Cloud Endpoints & Modernize with Surface specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "6024525",
      partnerName: "Software AG",
      partnerOneId: "6024525",
      partnerOneName: "Software AG", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: true,
        convergedCommunications: false,
        modernizeWithSurface: true,
        secureProductivity: false
      },
      capabilities: "Security, Cloud Endpoints & Modernize with Surface specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    },
    {
      sourceId: "3992580",
      partnerName: "TALENT BUSINESS SOLUTIONS",
      partnerOneId: "3992580",
      partnerOneName: "TALENT BUSINESS SOLUTIONS", 
      pillar: "Modern Work",
      specializations: {
        security: false,
        cloudEndpoints: false,
        convergedCommunications: false,
        modernizeWithSurface: false,
        secureProductivity: true
      },
      capabilities: "Secure Productivity specialization",
      userRequirements: "Minimum 10 users",
      coverage: "All France and all industries"
    },
    {
      sourceId: "2133171",
      partnerName: "UPPER-LINK",
      partnerOneId: "2133171",
      partnerOneName: "UPPER-LINK", 
      pillar: "Modern Work",
      specializations: {
        security: true,
        cloudEndpoints: false,
        convergedCommunications: true,
        modernizeWithSurface: false,
        secureProductivity: true
      },
      capabilities: "Security, Converged Communications & Secure Productivity specialization",
      userRequirements: "Standard requirements",
      coverage: "Regional coverage"
    }
  ],
  azure: [],
  dynamics: []
};

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

// QRP Partner search function
const findQRPPartner = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  
  // Search in all QRP categories
  for (const pillar of Object.keys(QRP_PARTNERS)) {
    const partners = QRP_PARTNERS[pillar];
    for (const partner of partners) {
      if (partner.sourceId.toLowerCase() === term ||
          partner.partnerOneId.toLowerCase() === term ||
          partner.partnerName.toLowerCase().includes(term) ||
          partner.partnerOneName.toLowerCase().includes(term)) {
        return partner;
      }
    }
  }
  return null;
};

// API Routes
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  const qrp = searchParams.get('qrp');
  const pillar = searchParams.get('pillar');
  
  try {
    // Handle QRP-specific queries
    if (qrp === 'true' || pillar) {
      if (pillar) {
        // Return all partners for a specific pillar
        const pillarPartners = QRP_PARTNERS[pillar.toLowerCase()] || [];
        return NextResponse.json({
          success: true,
          pillar: pillar,
          partners: pillarPartners
        });
      }
      
      if (id || search) {
        // Search for specific QRP partner
        const qrpPartner = findQRPPartner(id || search);
        if (qrpPartner) {
          return NextResponse.json({
            success: true,
            partner: qrpPartner,
            type: 'QRP'
          });
        }
      }
      
      // Return all QRP partners if no specific search
      return NextResponse.json({
        success: true,
        qrp: QRP_PARTNERS
      });
    }
    
    if (id || search) {
      // Search for specific partner (regular partners)
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